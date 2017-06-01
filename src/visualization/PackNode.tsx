import * as React from 'react';
import * as d3 from 'd3';

export default class PackNode extends React.Component<any, any> {
  private ghostCirc;
  private circ;

  componentDidMount() {
    // YOLO
    this.circ.__data__ = this.props.node;

    const d3Circle = d3.select(this.circ);
    d3Circle.call(this.props.dragBehavior);
  }

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

  onMouseOver(e: MouseEvent) {
    const node = this.props.node;
    this.props.onMouseOver(node, this.ghostCirc);
  }

  onMouseMove(e: MouseEvent) {
    const node = this.props.node;
    const coords = {x: e.clientX, y: e.clientY};
    this.props.onMouseMove(node, coords);
  }

  onMouseOut() {
    const node = this.props.node;
    this.props.onMouseOut(node, this.ghostCirc);
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name.substring(0, node.r / 3);
    const selectedClassName = isSelectedNode ? 'selected' : '';

    let circStyle = {};
    let TextArea;

    if (!node.children) {
      TextArea = <text dy={3}>{nodeName}</text>;
      circStyle = {
        fill: node.color,
        fillOpacity: 1
      };
    }

    return (
      <g className="pack" onClick={this.onTextClick.bind(this)} onMouseMove={this.onMouseMove.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.circ = c}>
        <circle r={node.r} className={`${selectedClassName}`}style={circStyle} />
        <circle r={node.r} className="ghost disabled" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.ghostCirc = c}/>
        {TextArea}
      </g>
    );
  }
}
