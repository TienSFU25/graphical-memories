import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import * as d3 from 'd3';

import { d3Node } from '../types';
import graphProcessor, { linkSrcTransform } from './graphProcessor';

export default class Link extends React.Component<any, any> {
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
    const el = this.container;

    const { transitionBehavior, processor } = this.state;

    el.transition(transitionBehavior)
      .attr('d', processor.linkDestTransform(nextProps.node));
  }

  componentWillAppear (callback) {
    const el = this.container;
    const { transitionBehavior, processor } = this.state;

    el.attr('d', linkSrcTransform(this.props.node))
      .transition(transitionBehavior)
      .attr('d', processor.linkDestTransform(this.props.node));

    callback();
  }

  componentWillEnter (callback) {
    const el = this.container;
    const { transitionBehavior, processor } = this.state;

    el.attr('d', linkSrcTransform(this.props.node))
      .transition(transitionBehavior)
      .attr('d', processor.linkDestTransform(this.props.node));

    callback();
  }

  componentWillLeave (callback) {
    const el = this.container;
    const { transitionBehavior, processor } = this.state;

    el.transition(transitionBehavior)
      .attr('d', linkSrcTransform(this.props.node))
      .attr('fill-opacity', 0);

    callback();
  }

  render () {
    return (
      <path className="link" ref={c => this.container=d3.select(c)} />
    );
  }
}
