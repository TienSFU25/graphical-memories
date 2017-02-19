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

  onMouseMove(e: MouseEvent) {
    // console.log('mousy!');
    const node = this.props.node;
    const coords = {x: e.clientX, y: e.clientY};
    this.props.onMouseMove(node, coords);
  }

  onMouseOut() {
    const node = this.props.node;
    this.props.onMouseOut(node);
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name.substring(0, node.r / 3);
    const selectedClassName = isSelectedNode ? 'selected' : '';

    let circStyle = {};
    let TextArea;

    if (!node.children) {
      TextArea = <text dy={3} onClick={this.onTextClick.bind(this)}>{nodeName}</text>;
      circStyle = {
        fill: node.color,
        fillOpacity: 1
      };
    }

    return (
      <g className="pack">
        <circle r={node.r} className={`${selectedClassName}`} onMouseMove={this.onMouseMove.bind(this)} onMouseOut={this.onMouseOut.bind(this)} style={circStyle} />
        {TextArea}
      </g>
    );
  }
}
