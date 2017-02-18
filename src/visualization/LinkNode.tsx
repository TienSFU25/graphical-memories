import * as React from 'react';
import * as d3 from 'd3';
import { NODE_WIDTH, NODE_HEIGHT, SPACE_VERTICAL, SPACE_HORIZONTAL } from './constants';
import graphProcessor, { nodeSrcTransform } from './graphProcessor';

function linkWidth(d) {
  var depth = d.depth;
  if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
    depth += 1;
  }
  return Math.max(6 - 2*depth, 1.5);
}

function color(branch) {
  return d3.schemeCategory20[branch];
}

export default class LinkNode extends React.Component<any, any> {
  private container;

  onNodeClick(e) {
    const { node } = this.props;

    this.props.onNodeClick(node);
    e.stopPropagation();
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name;
    const nodeClassName = node.children ? 'internal' : 'leaf';

    const y = -linkWidth(node) / 2;
    const x = -1;
    const width = NODE_WIDTH + 2;
    const height = linkWidth(node);
    const fill = color(node.branch);
    const translate = nodeSrcTransform(node);

    return (
      <g ref={g => this.container = d3.select(g)} transform={translate}>
        <rect y={y} x={x} height={height} width={width} fill={fill} onClick={this.onNodeClick.bind(this)} />
        <circle r={4.5} cx={NODE_WIDTH} stroke={fill} />
        <text x={10} textAnchor="start" dy={-5}>{nodeName}</text>
      </g>
    );
  }
}
