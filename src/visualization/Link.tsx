import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

import { d3Node } from '../types';
import graphProcessor, { linkSrcTransform } from './graphProcessor';

export default class Link extends React.Component<any, any> {
  private container;

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
    TweenMax.fromTo(el, 0.75, {attr: {d: this.state.processor.linkDestTransform(this.props.node)}}, {attr: {d: this.state.processor.linkDestTransform(nextProps.node)}});
  }

  componentWillEnter (callback) {
    const el = this.container;
    // src to parent
    TweenMax.to(el, 0.75, {attr: {d: this.state.processor.linkDestTransform(this.props.node)}, onComplete: callback});
  }

  componentWillLeave (callback) {
    // parent to src
    const el = this.container;
    TweenMax.fromTo(el, 0.75, {attr:{d: this.state.processor.linkDestTransform(this.props.node)}, opacity: 1}, {attr:{d: linkSrcTransform(this.props.node)}, opacity: 0, onComplete: callback});
  }

  render () {
    return (
      <path d={linkSrcTransform(this.props.node)} className="link" ref={c => this.container=c} />
    );
  }
}
