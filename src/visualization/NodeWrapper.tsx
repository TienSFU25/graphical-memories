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
      const el = this.container;

      const { transitionBehavior, processor } = this.state;

      el.transition(transitionBehavior)
        .attr('transform', processor.nodeDestTransform(nextProps.node));
    }

    _transitionSrcToDest() {
      const el = this.container;

      const { transitionBehavior, processor } = this.state;
      const { source } = this.props;

      el.attr('transform', nodeSrcTransform(source))
        .transition(transitionBehavior)
        .attr('transform', processor.nodeDestTransform(this.props.node));
    }

    componentDidMount () {
      this._transitionSrcToDest();
    }

    componentWillEnter (callback) {
      // console.log(`${this.props.node.data.name} entering`);
      this._transitionSrcToDest();
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
