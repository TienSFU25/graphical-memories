import * as React from 'react';
import * as d3 from 'd3';

import { d3Node } from '../types';

export default class Node extends React.Component<any, any> {
  private circ;
  private ghostCirc;

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
    const x = node.children ? - 8 : 8;
    const nodeName = node.data.name;
    const selectedClassName = isSelectedNode ? 'selected' : '';

    return (
      <g>
        <circle r={20} className="ghost disabled" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.ghostCirc = c}/>
        <circle r={7.5} className={`${selectedClassName}`} onMouseMove={this.onMouseMove.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.circ = c} />
        <text dy={3} x={x} onClick={this.onTextClick.bind(this)}>{nodeName}</text>
      </g>
    );
  }
}
