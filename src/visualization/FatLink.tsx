import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import * as d3 from 'd3';

import { d3Node } from '../types';
import graphProcessor, { linkSrcTransform } from './graphProcessor';

function linkWidth(d) {
  var depth = d.depth;
  if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
    depth += 1;
  }
  return Math.max(6 - 2*depth, 1.5);
}

function color(branch) {
  return d3.schemeCategory20[branch];
}

export default class FatLink extends React.Component<any, any> {
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

    el.attr('d', processor.linkSrcTransform(this.props.node))
      .transition(transitionBehavior)
      .attr('d', processor.linkDestTransform(this.props.node));

    callback();
  }

  componentWillEnter (callback) {
    const el = this.container;
    const { transitionBehavior, processor } = this.state;

    el.attr('d', processor.linkSrcTransform(this.props.node))
      .transition(transitionBehavior)
      .attr('d', processor.linkDestTransform(this.props.node));

    callback();
  }

  componentWillLeave (callback) {
    const el = this.container;
    const { transitionBehavior, processor } = this.state;

    el.transition(transitionBehavior)
      .attr('d', processor.linkSrcTransform(this.props.node))
      .attr('fill-opacity', 0);

    callback();
  }

  render () {
    const {node} = this.props;
    const stroke = color(node.branch);
    const strokeWidth = linkWidth(node);

    return (
      <path fill="none" stroke={stroke} strokeWidth={strokeWidth} ref={c => this.container=d3.select(c)} />
    );
  }
}


    // link.enter().insert("path", "g")
    //     .attr("class", "markmap-link")
    //     .attr('stroke', function(d: any) { return color(d.target.branch); })
    //     .attr('stroke-width', function(l) {return linkWidth(l.target);})
    //     .attr('fill', 'none')
    //     .attr("d", function(d) {
    //       var x = source.x;
    //       var y = source.y + state.nodeWidth;

    //       return `M${x},${y}`
    //         + `C${x},${y}`
    //         + ` ${x},${y}`
    //         + ` ${x},${y}`
    //     })
    //     .transition(tb)
    //     .attr("d", function(d) {
    //       var s = {x: d.source['y'] + state.nodeWidth, y: d.source['x']};
    //       var t = {x: d.target['y'], y: d.target['x']};

    //       var midx = (s.x + t.x) / 2;

    //       return `M${s.x},${s.y}`
    //         + `C${midx},${s.y}`
    //         + ` ${midx},${t.y}`
    //         + ` ${t.x},${t.y}`

    //       // return linkShape({source: s, target: t});
    //     });
