import data from '../data/flare';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';

import { attachIds } from '../visualization/treeManipulator';
import { d3Node } from '../types';

const DEFAULT_NODE_NAME = 'default';

export default class Collapsible extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const svg = d3.select('#collapsible');
    const g = svg.append('g');
    const OFFSET = 20;

    const dataSet = data[0].value;
    attachIds(dataSet);

    const newRoot = d3.hierarchy(dataSet);
    let tree = d3.tree().nodeSize([0, OFFSET]);

    function _sortTree(root) {
      const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
      root.sort(sorter);
    }

    _sortTree(newRoot);
    tree(newRoot);

    let i = 0;
    newRoot.eachBefore((d: d3Node) => {
      d.x = d.y;
      d.y = i * OFFSET;
      i++;
    });

    const nodes = g.selectAll('.node').data(newRoot.descendants(), d => d['data'].id);
    const nodeTransform = (d) => {
      console.log(`${d.x}, ${d.y}`);
      return `translate(${d.x},${d.y})`
    };

    const enterNodes = nodes.enter().append('g')
      .attr('transform', nodeTransform);

    const color = (d: d3Node) => {
      return d.children ? 'lightblue' : "rgb(253, 141, 60)";
    };

    enterNodes.append('rect')
      .attr('y', -10)
      .attr('height', 20)
      .attr('width', 500)
      .attr('fill', color);

    enterNodes.append('text')
      .attr('dx', 3.5)
      .attr('dy', 5.5)
      .text(d => d.data.name);

    const transitionBehavior = d3.transition('myT').duration(750);
    const linkDestTransform = (d: d3Node) => {
        return `M${d.x},${d.y}`
          + `C${d.parent.x + 100},${d.y}`
          + ` ${d.parent.x + 100},${d.parent.y}`
          + ` ${d.parent.x},${d.parent.y}`;
      };
    const links = g.selectAll('.link')
      .data(newRoot.descendants().slice(1), d => d['data'].id);

    const enterLinks = links.enter()
      .insert('path', 'g')
      .attr('d', (d: d3Node) => {
          return `M${d.parent.x},${d.parent.y}`
            + `C${d.parent.x},${d.parent.y}`
            + ` ${d.parent.x},${d.parent.y}`
            + ` ${d.parent.x},${d.parent.y}`
      })
      .merge(links)
      .transition(transitionBehavior)
      .attr('class', 'link')
      .attr('d', linkDestTransform);

    const exitLinks = links.exit()
      .transition(transitionBehavior)
      .attr('d', (d: d3Node) => {
        return `M${d.parent.x},${d.parent.y}`
          + `C${d.parent.x},${d.parent.y}`
          + ` ${d.parent.x},${d.parent.y}`
          + ` ${d.parent.x},${d.parent.y}`
      })
      .remove();

    window['nodes'] = nodes;
    window['root'] = newRoot;
  }

  render() {
    return <svg id="collapsible" width={960} height={1000} />
  }
}
