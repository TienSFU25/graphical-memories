import * as React from 'react';
import * as d3 from 'd3';

import { d3Node } from '../types';
import graphProcessor, { nodeSrcTransform } from './graphProcessor';

export default class Node extends React.Component<any, any> {
  private container;
  private circ;
  private ghostCirc;

  constructor(props) {
    super(props);

    const {display} = this.props;
    this.state = {
      processor: graphProcessor[display],
      transitionBehavior: d3.transition('myT').duration(750)
    };
  }

  componentWillUpdate(nextProps) {
    const el = this.container;

    const { transitionBehavior, processor } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', processor.nodeDestTransform(nextProps.node));
  }

  componentWillAppear (callback) {
    const el = this.container;
    const { transitionBehavior } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', nodeSrcTransform(this.props.node));

    callback();
  }

  componentWillEnter (callback) {
    console.warn(`node ${this.props.node.data.name} entering`);

    const el = this.container;
    const { transitionBehavior } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', nodeSrcTransform(this.props.node));

    callback();
  }

  componentWillLeave (callback) {
    console.warn(`node ${this.props.node.data.name} leaving`);

    const el = this.container;
    const { source } = this.props;
    const { transitionBehavior } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', nodeSrcTransform(source))
      .attr('fill-opacity', 0);

    callback();
  }

  componentDidMount() {
    // YOLO
    this.circ.__data__ = this.props.node;

    const d3Circle = d3.select(this.circ);
    d3Circle.call(this.props.dragBehavior);
  }

  onTextClick() {
    const node = this.props.node;
    this.props.onTextClick(node);
  }

  onMouseOver() {
    const node = this.props.node;
    this.props.onMouseOver(node, this.ghostCirc);
  }

  onMouseOut() {
    const node = this.props.node;
    this.props.onMouseOut(node, this.ghostCirc);
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const x = node.children ? - 8 : 8;
    const nodeName = node.data.name;
    const { nodeDestTransform } = this.state.processor;
    const nodeClassName = node.children ? 'internal' : 'leaf';
    const selectedClassName = isSelectedNode ? 'selected' : '';

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} ref={g => this.container = d3.select(g)}>
        <circle r={20} className="ghost disabled" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.ghostCirc = c}/>
        <circle r={7.5} className={`inner ${selectedClassName}`} ref={c => this.circ = c} />
        <text dy={3} x={x} className={nodeClassName} onClick={this.onTextClick.bind(this)}>{nodeName}</text>
      </g>
    );
  }
}
