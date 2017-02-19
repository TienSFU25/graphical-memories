import * as React from 'react';

export default class PackNode extends React.Component<any, any> {
  private container;

  onTextClick(e) {
    const node = this.props.node;
    this.props.onTextClick(node);
    e.stopPropagation();
  }

  onNodeClick(e) {
    const { node } = this.props;

    this.props.onNodeClick(node);
    e.stopPropagation();
  }

  onMouseOver() {
    const node = this.props.node;
    this.props.onMouseOver(node);
  }

  onMouseOut() {
    const node = this.props.node;
    this.props.onMouseOut(node);
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name.substring(0, node.r / 3);
    const nodeClassName = 'pack-node';
    const selectedClassName = isSelectedNode ? 'selected' : '';

    let circStyle = {};
    let TextArea;

    if (!node.children) {
      TextArea = <text dy={3} className={nodeClassName} onClick={this.onTextClick.bind(this)}>{nodeName}</text>;
      circStyle = {
        fill: node.color
      };
    }

    return (
      <g>
        <circle r={node.r} className={`pack ${selectedClassName}`} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} style={circStyle} />
        {TextArea}
      </g>
    );
  }
}
