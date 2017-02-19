import * as React from 'react';
import * as d3 from 'd3';

import { d3Node } from '../types';
import { nodeIdentityTransform } from './graphProcessor';

export default function(WrappedComponent) {
  return class Wrapper extends React.Component<any, any> {
    private container;

    constructor(props) {
      super(props);

      const {display} = this.props;
      this.state = {
        transitionBehavior: d3.transition('myT').duration(750)
      };
    }

    shouldComponentUpdate(nextProps) {
      return (this.props.node !== nextProps.node);
    }

    componentWillUpdate(nextProps) {
      // console.log(`UPDATING`);
      const el = this.container;

      const { transitionBehavior } = this.state;

      el.transition(transitionBehavior)
        .attr('transform', nodeIdentityTransform(nextProps.node));
    }

    _transitionSrcToDest() {
      const el = this.container;

      const { transitionBehavior, processor } = this.state;
      const { source, node } = this.props;

      el.attr('transform', nodeIdentityTransform(source))
        .transition(transitionBehavior)
        .attr('transform', nodeIdentityTransform(node));
    }

    componentDidMount () {
      this._transitionSrcToDest();
    }

    componentWillEnter (callback) {
      console.log(`${this.props.node.data.name} entering`);
      this._transitionSrcToDest();
      callback();
    }

    componentWillLeave(callback) {
      console.log(`${this.props.node.data.name} leaving`);
      // console.log('LEAVING');
      const el = this.container;
      const { source, node } = this.props;

      const transition = d3.transition('').duration(750);
      el.transition(transition)
        .attr('transform', nodeIdentityTransform(source))
        .attr('fill-opacity', 0)
        .on('end', callback);
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
