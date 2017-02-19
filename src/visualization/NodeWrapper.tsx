import * as React from 'react';
import * as d3 from 'd3';

import { d3Node } from '../types';
import graphProcessor, { nodeSrcTransform } from './graphProcessor';

export default function(WrappedComponent) {
  return class Wrapper extends React.Component<any, any> {
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
      // console.log(`UPDATING`);
      // const el = this.container;

      // const { transitionBehavior, processor } = this.state;

      // el.transition(transitionBehavior)
      //   .attr('transform', processor.nodeDestTransform(nextProps.node));
    }

    _transitionSrcToDest() {
      const el = this.container;

      const { transitionBehavior, processor } = this.state;
      const { source, node } = this.props;

      // el.attr('transform', nodeSrcTransform(source))
      el.attr('transform', 'translate(0,0)')
        .transition(transitionBehavior)
        .attr('transform', processor.nodeDestTransform(node));
    }

    componentDidMount () {
      this._transitionSrcToDest();
    }

    componentWillEnter (callback) {
      console.log(`${this.props.node.data.name} entering`);
      this._transitionSrcToDest();
      callback();
    }

    componentWillUnmount(callback) {
      // console.log(`${this.props.node.data.name} leaving`);
      console.log('LEAVING');
      const el = this.container;
      const { source, node } = this.props;
      const { transitionBehavior, processor } = this.state;

      window['ndt'] = (processor.nodeDestTransform(node));
      window['el'] = el;
      window['nst'] = (nodeSrcTransform(source));
      window['t'] = transitionBehavior;

      el.transition(d3.transition('myT').duration(5000))
        .attr('transform', `translate(0, 0)`);
      // el.attr('transform', processor.nodeDestTransform(node))
      // el.transition(transitionBehavior)
      //   .attr('transform', nodeSrcTransform(source))
        // .attr('fill-opacity', 0)
        // .on('end', () => { console.log('ended!')});

      // callback();
    }

    onNodeClick() {
      const { node } = this.props;

      this.props.onNodeClick(node);
    }

    render () {
      const { node, source, isSelectedNode } = this.props;
      const nodeClassName = node.children ? 'internal' : 'leaf';

      const {...props} = this.props;

      return (
        <g id={node.data.id} className={`node ${nodeClassName}`} ref={g => this.container = d3.select(g)}>
          <WrappedComponent {...props} />
        </g>
      );
    }
  }
}
