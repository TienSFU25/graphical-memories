import * as React from 'react';

export default class Rect extends React.Component<any, any> {
  onNodeClick(e) {
    const { node } = this.props;

    this.props.onNodeClick(node);
    e.stopPropagation();
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name;

    return (
      <g>
        <rect y={-10} height={20} width={500} fill="lightsalmon" onClick={this.onNodeClick.bind(this)} />
        <text dx={3.5} dy={5.5}>{nodeName}</text>
      </g>
    );
  }
}
