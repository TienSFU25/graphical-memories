import * as React from 'react';
import * as d3 from 'd3';
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
      processor: graphProcessor[display],
      transitionBehavior: d3.transition('myT').duration(750)
    };
  }

  componentWillUpdate(nextProps) {
    // this state to next state
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
    const el = this.container;
    const { transitionBehavior } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', nodeSrcTransform(this.props.node));

    callback();
  }

  componentWillLeave (callback) {
    const el = this.container;
    const { source } = this.props;
    const { transitionBehavior } = this.state;

    el.transition(transitionBehavior)
      .attr('transform', nodeSrcTransform(source))
      .attr('fill-opacity', 0);

    callback();
  }

  onNodeClick() {
    const { node } = this.props;

    this.props.onNodeClick(node);
  }

  render () {
    const { node, source, isSelectedNode } = this.props;
    const nodeName = node.data.name;
    const nodeClassName = node.children ? 'internal' : 'leaf';

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} ref={g => this.container = d3.select(g)}>
        <rect y={-10} height={20} width={500} fill="lightsalmon" onClick={this.onNodeClick.bind(this)} />
        <text dx={3.5} dy={5.5}>{nodeName}</text>
      </g>
    );
  }
}
