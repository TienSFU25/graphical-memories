console.log('hello!');

import data from './flare';
import * as d3 from 'd3';

window['d3'] = d3;
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

  const sorter = (a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase());

  var root = stratify(data).sort(sorter);

  tree(root);

  function update(source) {
    console.log(`updating ${source.id}`);

    // var nodeData = tree.nodes(root).reverse(),
    //     links = tree.links(nodes);
    var t = d3.transition('myT').duration(750);

    var nodes = g.selectAll('.node')
      .data(root.descendants(), d => d['id']);

    var enterNodes = nodes.enter().append('g');

    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    enterNodes.append('circle')
      .attr('r', 4.5)
      .on('click', thisNode =>
      {
        toggle(thisNode);
        update(thisNode);
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

  update(root);
}
