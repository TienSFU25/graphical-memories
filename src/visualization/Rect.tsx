import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

import { d3Node } from '../types';
import graphProcessor, { nodeSrcTransform } from './graphProcessor';

export default class Rect extends React.Component<any, any> {
  private container;

  constructor(props) {
    super(props);

    const {display} = this.props;
    this.state = {
      processor: graphProcessor[display]
    };
  }

  // componentWillUpdate(nextProps) {
  //   // this state to next state
  //   const el = this.container;
  //   TweenMax.fromTo(el, 0.75, {attr: {d: this.state.processor.linkDestTransform(this.props.node)}}, {attr: {d: this.state.processor.linkDestTransform(nextProps.node)}});
  // }

  // componentWillEnter (callback) {
  //   const el = this.container;
  //   // src to parent
  //   TweenMax.to(el, 0.75, {attr: {d: this.state.processor.linkDestTransform(this.props.node)}, onComplete: callback});
  // }

  // componentWillLeave (callback) {
  //   // parent to src
  //   const el = this.container;
  //   TweenMax.fromTo(el, 0.75, {attr:{d: this.state.processor.linkDestTransform(this.props.node)}, opacity: 1}, {attr:{d: linkSrcTransform(this.props.node)}, opacity: 0, onComplete: callback});
  // }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const x = node.children ? - 8 : 8;
    const nodeName = node.data.name;
    const { nodeDestTransform } = this.state.processor;
    const nodeClassName = node.children ? 'internal' : 'leaf';
    const selectedClassName = isSelectedNode ? 'selected' : '';

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} transform={nodeSrcTransform(node)} ref={g => this.container = g}>
        <rect y={-10} height={20} width={500} fill="lightsalmon" />
        <text dx={3.5} dy={5.5}>{node.data.name}</text>
      </g>
    );
  }
}

    // enterNodes.append('rect')
    //   .attr('y', -10)
    //   .attr('height', 20)
    //   .attr('width', 500)
    //   .attr('fill', color);

    // enterNodes.append('text')
    //   .attr('dx', 3.5)
    //   .attr('dy', 5.5)
    //   .text(d => d.data.name);
