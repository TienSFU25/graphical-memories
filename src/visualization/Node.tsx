import * as React from 'react';
import * as d3 from 'd3';
import { TweenMax } from 'gsap';

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
      processor: graphProcessor[display]
    };
  }

  componentWillUpdate(nextProps) {
    // this state to next state
    const el = this.container;
    TweenMax.fromTo(el, 0.75, {attr: {transform: this.state.processor.nodeDestTransform(this.props.node)}}, {attr: {transform: this.state.processor.nodeDestTransform(nextProps.node)}});
  }

  componentWillEnter (callback) {
    const el = this.container;
    // src to parent
    TweenMax.to(el, 0.75, {attr: {transform: this.state.processor.nodeDestTransform(this.props.node)}, onComplete: callback});
  }

  componentWillLeave (callback) {
    // parent to src
    const el = this.container;
    const { source } = this.props;
    TweenMax.fromTo(el, 0.75, {attr:{transform: this.state.processor.nodeDestTransform(this.props.node)}, opacity: 1}, {attr:{transform: nodeSrcTransform(source)}, opacity: 0, onComplete: callback});
  }

  componentDidMount() {
    // YOLO
    this.circ.__data__ = this.props.node;

    const d3Circle = d3.select(this.circ);
    d3Circle.call(this.props.dragBehavior);
  }

  onCircleClick() {
    const node = this.props.node;
    this.props.onClick(node);
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
    const { node, source } = this.props;
    const x = node.children ? - 8 : 8;
    const nodeClassName = node.children ? 'internal' : 'leaf';
    const nodeName = node.data.name;
    const { nodeDestTransform } = this.state.processor;

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} transform={nodeSrcTransform(source)} ref={g => this.container = g}>
        <circle r={20} className="ghost disabled" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.ghostCirc = c}/>
        <circle r={7.5} className="inner" ref={c => this.circ = c} />
        <text dy={3} x={x} className={nodeClassName} onClick={this.onTextClick.bind(this)}>{nodeName}</text>
      </g>
    );
  }
}
