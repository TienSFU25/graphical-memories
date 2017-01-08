console.log('hello!');

import data from './flare';
import * as d3 from 'd3';
import * as _ from 'lodash';

require('./styles.scss');

export default function init() {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 2400 - margin.top - margin.bottom;

  // add the svg canvas
  var svg = d3.select('#chart')
              .append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);

  var g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

  var tree = d3.tree().size([height, width - 160]);

  var stratify = d3.stratify().parentId(d => {
    return d['id'].substring(0, d['id'].lastIndexOf('.'));
  });

  var isDragging = false;
  var destDragNode;
  var root = stratify(data);

  function sortTree(root) {
    const sorter = (a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase());
    root.sort(sorter);
  }

  function attachMids(root) {
    root.descendants().forEach(node => {
      const depth = node.depth;
      node.mid = node.id.split('.')[depth];
    });
  }

  function visit(node, args, preFn, postFn=(a, b) => 1) {
    if (node == null) return;

    preFn(node, args);
    const children = node.children || node._children;

    _.forEach(children, child => {
      visit(child, args, preFn, postFn);
    });

    postFn(node, args);
  }

  function updateIdsByMids(root) {
    const preVisitor = (node, mids) => {
      mids.push(node.mid);
      node.id = mids.join('.');
    };

    const postVisitor = (node, mids) => mids.pop();

    visit(root, [], preVisitor, postVisitor);

    // function visit(node, mids) {
    //   mids.push(node.mid);

    //   node.id = mids.join('.');

    //   const children = node.children || node._children;
    //   _.forEach(children, child => {
    //     visit(child, mids);
    //   });

    //   mids.pop();
    // }

    // visit(root, []);
  }

  var dragger = d3.drag()
    .on('start', d => {
      isDragging = true;
      d3.selectAll('.ghost.disabled').attr('class', 'ghost');
    })
    .on('end', d => {
      isDragging = false;
      d3.selectAll('.ghost').attr('class', 'ghost disabled');

      if (destDragNode) {
        moveTo(d, destDragNode);
        destDragNode = null;
      }
    });


  function update(initial = false, source = root) {
    sortTree(root);

    if (initial) {
      attachMids(root);
    }

    updateIdsByMids(root);
    tree(root);

    console.log(`updating ${source.id}`);
    var t = d3.transition('myT').duration(750);

    var nodes = g.selectAll('.node')
      .call(dragger)
      .data(root.descendants(), d => d['id']);

    nodes.transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    var enterNodes = nodes.enter().append('g');

    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    enterNodes.append('circle')
      .attr('r', 9)
      .attr('class', 'ghost disabled')
      .on('mouseover', function(d) {
        if (isDragging) {
          destDragNode = d;
          d3.select(this)
            .attr('class', 'ghost hover');
        }
      })
      .on('mouseout', function(d) {
        if (isDragging) {
          destDragNode = null;
          d3.select(this)
            .attr('class', 'ghost');
        }
      });

    enterNodes.append('circle')
      .attr('r', 4.5)
      .on('click', thisNode =>
      {
        toggle(thisNode);
        update(false, thisNode);
      });

    enterNodes.append('text')
      .attr('dy', 3)
      .attr('x', d => d['children'] ? -8 : 8)
      .attr('class', d => d['children'] ? 'internal': 'leaf')
      .text(d => d['id'].substring(d['id'].lastIndexOf('.') + 1));

    var exitNodes = nodes.exit()
      .transition(t)
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    t = d3.transition('myT').duration(750);
    var links = g.selectAll('.link')
      .data(root.descendants().slice(1), d => d['id']);

    links.transition(t)
      .attr('d', d => {
        return `M${d['y']},${d['x']}`
          + `C${d['parent']['y'] + 100},${d['x']}`
          + ` ${d['parent']['y'] + 100},${d['parent']['x']}`
          + ` ${d['parent']['y']},${d['parent']['x']}`
      });

    var enterLinks = links.enter()
      .append('path')
      .attr('d', d => {
        return `M${source['y']},${source['x']}`
          + `C${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
      })
      .transition(t)
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d['y']},${d['x']}`
          + `C${d['parent']['y'] + 100},${d['x']}`
          + ` ${d['parent']['y'] + 100},${d['parent']['x']}`
          + ` ${d['parent']['y']},${d['parent']['x']}`
      });

    var exitLinks = links.exit()
      .transition(t)
      .attr('d', d => {
        return `M${source['y']},${source['x']}`
          + `C${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
      })
      .remove();
  }

  function toggle(node) {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null
    }
  }

  function moveTo(src, dest) {
    console.log(`moving ${src.id} to ${dest.id}`);

    const parentDepth = src.parent.depth;
    const destDepth = dest.depth;

    // delete from parent
    let index = src.parent.children.indexOf(src);

    if (index > -1) {
      if (src.parent.children.length == 1) {
        src.parent.children = null;
      } else {
        src.parent.children.splice(index, 1);
      }
    }

    // update destination node's children
    let children = dest.children || dest._children;

    if (!children) {
      dest.children = [];
    }
    else if (dest._children) {
      toggle(dest);
    }

    dest.children.push(src);

    // change parent link
    src.parent = dest;

    // update depths
    const visitor = (node, {parentDepth, destDepth}) => {
      node.depth = node.depth - parentDepth + destDepth;
    };

    visit(src, {parentDepth, destDepth}, visitor);

    // updating heights does not seem to matter

    update();
  }

  update(true);

  window['d3'] = d3;
  window['tree'] = tree;
  window['update'] = update;

  window['root'] = root;
  window['moveTo'] = moveTo;
  window['toggle'] = toggle;

  window['dest'] = root.children[9].children[4];
  window['src'] = root.children[9].children[5].children[1];
}
