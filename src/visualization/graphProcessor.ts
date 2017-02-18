import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT, RADIAL_X, RADIAL_Y, COLLAPSIBLE_OFFSET, NODE_WIDTH, NODE_HEIGHT, SPACE_VERTICAL, SPACE_HORIZONTAL } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { d3Node, d3ColorNode, d3RootNode, EntityType, SelectedEntity, TreeReducerState, TreeType } from '../types';
import { project } from './treeManipulator';

export function nodeSrcTransform(source: d3Node) {
  return `translate(${source.x}, ${source.y})`;
}

export function linkSrcTransform(d: d3Node) {
  return `M${d.parent.x},${d.parent.y}`
    + `C${d.parent.x},${d.parent.y}`
    + ` ${d.parent.x},${d.parent.y}`
    + ` ${d.parent.x},${d.parent.y}`;
}

function traverseMinDistance(node) {
  var val = Infinity;
  if (node.children) {
    val = Math.min.apply(null, node.children.map(traverseMinDistance));
    if (node.children.length > 1) {
      console.log(`for ${node.data.name}: ${Math.abs(node.children[0].x - node.children[1].x)}`);
      val = Math.min(val, Math.abs(node.children[0].x - node.children[1].x));
    }
  }
  // val = Math.min(val, Math.abs(node.children[0].x - node.children[1].x));
  return val;
}

function getLabelWidth(d) {
  // constant ratio for now, needs to be measured based on font
  return d.name.length * 5;
}

function traverseLabelWidth(d, offset) {
  d.y += offset;
  if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
    var child = d.children[0];
    offset += d.y + getLabelWidth(d) - child.y;
    child.y += offset;
    if (child.children) {
      child.children.forEach(function(c) {
        traverseLabelWidth(c, offset);
      });
    }
  }
}

function traverseBranchId(node, branch) {
  node.branch = branch;
  if (node.children) {
    node.children.forEach(function(d) {
      traverseBranchId(d, branch);
    });
  }
}

export default {
  0: {
    getTree(height, width) {
      return d3.tree().size([height, width]);
    },
    processRoot(root: d3RootNode) {
      root.each((node: d3Node) => {
        // swap x and y
        const oldY = node.y;
        node.y = node.x;
        node.x = oldY
      });
    },
    setDs(newRoot: d3RootNode) {
      newRoot.dx = 0;
      newRoot.dy = 0;
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkDestTransform(d: d3Node) {
      return `M${d.x},${d.y}`
        + `C${d.parent.x + 100},${d.y}`
        + ` ${d.parent.x + 100},${d.parent.y}`
        + ` ${d.parent.x},${d.parent.y}`;
    }
  },
  1: {
    getTree(height, width) {
      return d3.tree().size([height / 3.33, width / 1.2]).separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
    },
    processRoot(root: d3RootNode) {
      root.each((node: d3Node) => {
        // stash original coordinates. this is used for links
        node.x0 = node.x;
        node.y0 = node.y;

        [node.x, node.y] = project(node.x, node.y);
      });
    },
    setDs(newRoot: d3RootNode) {
      newRoot.dx = RADIAL_X,
      newRoot.dy = RADIAL_Y
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkDestTransform(d: d3Node) {
      return "M" + (project(d.x0, d.y0))
          + "C" + (project(d.x0, (d.y0 + d.parent.y0) / 2))
          + " " + (project(d.parent.x0, (d.y0 + d.parent.y0) / 2))
          + " " + (project(d.parent.x0, d.parent.y0));
    }
  },
  2: {
    getTree(height, width) {
      return d3.tree().nodeSize([0, COLLAPSIBLE_OFFSET]);
    },
    processRoot(root: d3RootNode) {
      let i = 0;

      const dfs = (node:d3Node) => {
        node.x = node.y;
        node.y = i * COLLAPSIBLE_OFFSET;
        i++;

        if (node.children) {
          for (let child of node.children) {
            dfs(child);
          }
        }
      }

      dfs(root);
    },
    setDs(newRoot: d3RootNode) {
      newRoot.dx = 0,
      newRoot.dy = 0
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkDestTransform(d: d3Node) {
      return `M${d.x},${d.y}`
        + `C${d.parent.x + 100},${d.y}`
        + ` ${d.parent.x + 100},${d.parent.y}`
        + ` ${d.parent.x},${d.parent.y}`;
    }
  },
  3: {
    getTree(height, width) {
      return d3.tree();
      // return d3.tree().size([height, width]);
    },
    processRoot(root: d3ColorNode) {
      let offset = 800 / 2;

      // Normalize
      var ratio = (NODE_HEIGHT + SPACE_VERTICAL) / traverseMinDistance(root);
      offset -= root.x * ratio;

      root.eachBefore(function(d: d3ColorNode) {
        d.y = d.x * ratio + offset;
        d.x = d.depth * (NODE_WIDTH + SPACE_HORIZONTAL);
      });

      // root.each((node: d3Node) => {
      //   // swap x and y
      //   const oldY = node.y;
      //   node.y = node.x;
      //   node.x = oldY
      // });

      // stick in some branch numbers
      function traverseBranchId(node, branch) {
        node.branch = branch;
        if (node.children) {
          node.children.forEach(function(d) {
            traverseBranchId(d, branch);
          });
        }
      }

      root.children.forEach((d, i) => {
        traverseBranchId(d, i);
      });
    },
    setDs(newRoot: d3RootNode) {
      newRoot.dx = 0,
      newRoot.dy = 0
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkSrcTransform(d: d3Node) {
      const x = d.parent.x;
      const y = d.parent.y;

      return `M${x},${y}`
        + `C${x},${y}`
        + ` ${x},${y}`
        + ` ${x},${y}`;
    },
    linkDestTransform(d: d3Node) {
          var s = {x: d.x, y: d.y};
          var t = {x: d.parent['x'] + NODE_WIDTH, y: d.parent['y']};

          var midx = (s.x + t.x) / 2;

          return `M${s.x},${s.y}`
            + `C${midx},${s.y}`
            + ` ${midx},${t.y}`
            + ` ${t.x},${t.y}`

      // return `M${d.x + NODE_WIDTH},${d.y}`
      //   + `C${midX},${d.y}`
      //   + ` ${midX},${d.parent.y}`
      //   + ` ${d.parent.x},${d.parent.y}`;
    }
  }
}

    // let offset = HEIGHT / 2;

    // const nodes = d3.hierarchy(dataSet);
    // const root:d3ColorNode = nodes;

    // // console.log(nodes);
    // layout(nodes);
    // const links = nodes.links();

    // // Normalize
    // var ratio = (state.nodeHeight + state.spacingVertical) / traverseMinDistance(root);
    // offset -= root.x * ratio;

    // console.log(state.nodeHeight + state.spacingVertical);
    // console.log(traverseMinDistance(root));
    // console.log(ratio);
    // console.log(offset);

    // nodes.eachBefore(function(d: d3ColorNode) {
    //   // console.log(d.x);
    //   d.y = d.depth * (state.nodeWidth + state.spacingHorizontal);
    //   d.x = d.x * ratio + offset;
    // });


    // // stick in some branch numbers
    // function traverseBranchId(node, branch) {
    //   node.branch = branch;
    //   if (node.children) {
    //     node.children.forEach(function(d) {
    //       traverseBranchId(d, branch);
    //     });
    //   }
    // }

    // nodes.children.forEach((d, i) => {
    //   traverseBranchId(d, i);
    // });

    // const source = root;
    // function linkWidth(d) {
    //   var depth = d.depth;
    //   if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
    //     depth += 1;
    //   }
    //   return Math.max(6 - 2*depth, 1.5);
    // }

