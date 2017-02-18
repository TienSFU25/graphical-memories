import data from './data/gtor';

import * as React from 'react';
import * as d3 from 'd3';

import { attachIds } from '../visualization/treeManipulator';
import { d3ColorNode } from '../types';

const DEFAULT_NODE_NAME = 'default';

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

var state = {
  nodeHeight: 20,
  nodeWidth: 180,
  spacingVertical: 10,
  spacingHorizontal: 120,
  duration: 750,
  layout: 'tree',
  color: 'gray',
  linkShape: 'diagonal',
  renderer: 'boxed'
};

export default class Colorful extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const svg = d3.select('#collapsible');
    const g = svg.append('g');
    // const OFFSET = 20;

    // const dataSet = data[0].value;
    // attachIds(dataSet);
    const dataSet = data;

    const HEIGHT = 800;
    const layout = d3.tree();
    let offset = HEIGHT / 2;

    const nodes = d3.hierarchy(dataSet);
    const root:d3ColorNode = nodes;

    // console.log(nodes);
    layout(nodes);
    const links = nodes.links();

    // Normalize
    var ratio = (state.nodeHeight + state.spacingVertical) / traverseMinDistance(root);
    offset -= root.x * ratio;

    console.log(state.nodeHeight + state.spacingVertical);
    console.log(traverseMinDistance(root));
    console.log(ratio);
    console.log(offset);

    nodes.eachBefore(function(d: d3ColorNode) {
      // console.log(d.x);
      d.y = d.depth * (state.nodeWidth + state.spacingHorizontal);
      d.x = d.x * ratio + offset;
    });

    // stick in some branch numbers
    function traverseBranchId(node, branch) {
      node.branch = branch;
      if (node.children) {
        node.children.forEach(function(d) {
          traverseBranchId(d, branch);
        });
      }
    }

    nodes.children.forEach((d, i) => {
      traverseBranchId(d, i);
    });

    const source = root;
    function linkWidth(d) {
      var depth = d.depth;
      if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
        depth += 1;
      }
      return Math.max(6 - 2*depth, 1.5);
    }

    // Update the nodes…
    var node = svg.selectAll("g.markmap-node")
        .data(nodes.descendants(), function(d) { return d.id || (d.id = ++this.i); }.bind(this));

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "markmap-node")
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })

    nodeEnter.append('rect')
      .attr('class', 'markmap-node-rect')
      .attr("y", function(d) { return -linkWidth(d) / 2 })
      .attr('x', state.nodeWidth)
      .attr('width', state.nodeWidth + 2)
      .attr('height', linkWidth)
      .attr('fill', (d: d3ColorNode) => { return color(d.branch); });

    function color(branch) {
      return d3.schemeCategory20[branch];
    }

    nodeEnter.append("circle")
        .attr('class', 'markmap-node-circle')
        .attr('cx', state.nodeWidth)
        .attr('stroke', function(d:any) { return color(d.branch); })
        .attr("r", 1e-6)
        .style("fill", function(d:any) { return d._children ? color(d.branch) : ''; });

    nodeEnter.append("text")
        .attr('class', 'markmap-node-text')
        .attr("x", state.nodeWidth)
        .attr("dy", "-5")
        .attr("text-anchor", function(d) { return "start"; })
        .text(function(d) { return d.data.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.

    // var nodeUpdate = node.transition()
    var nodeUpdate = nodeEnter.transition()
        .duration(state.duration)
        .attr("transform", function(d: d3ColorNode) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select('rect')
      .attr('x', -1)
      .attr('width', state.nodeWidth + 2);

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d:any) { return d._children ? color(d.branch) : ''; })
          .style('display', function(d: d3ColorNode) {
            var hasChildren = d.children || d._children;
            return hasChildren ?  'inline' : 'none';
          });

      nodeUpdate.select("text")
          .attr("x", 10)
          .style("fill-opacity", 1);

    // Update the links…
    var link = svg.selectAll("path.markmap-link")
        .data(links);

    const tb = d3.transition('').duration(state.duration);

    // Enter any new links at the parent's previous position.
    // link.enter().insert("path", "g")
    //     .attr("class", "markmap-link")
    //     .attr('stroke', function(d: any) { return color(d.target.branch); })
    //     .attr('stroke-width', function(l) {return linkWidth(l.target);})
    //     .attr('fill', 'none')
    //     .attr("d", function(d) {
    //       var o = {x: source.x, y: source.y + state.nodeWidth};
    //       var x = source.x;
    //       var y = source.y + state.nodeWidth;

    //       return `M${x},${y}`
    //         + `C${x},${y}`
    //         + ` ${x},${y}`
    //         + ` ${x},${y}`
    //     })
    //     .transition(tb)
    //     .attr("d", function(d) {
    //       var s = {x: d.source['y'] + state.nodeWidth, y: d.source['x']};
    //       var t = {x: d.target['y'], y: d.target['x']};

    //       var midx = (s.x + t.x) / 2;

    //       return `M${s.x},${s.y}`
    //         + `C${midx},${s.y}`
    //         + ` ${midx},${t.y}`
    //         + ` ${t.x},${t.y}`

    //       // return linkShape({source: s, target: t});
    //     });
  }

  render() {
    return <svg id="collapsible" width={2000} height={1000} />
  }
}
