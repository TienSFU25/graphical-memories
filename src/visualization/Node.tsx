import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

import { d3Node } from '../types';
import graphProcessor from './graphProcessor';

const p = graphProcessor[0];

function calc(d) {
    // const source = this.props.source;

    return `M${d.parent.x},${d.parent.y}`
      + `C${d.parent.x},${d.parent.y}`
      + ` ${d.parent.x},${d.parent.y}`
      + ` ${d.parent.x},${d.parent.y}`
  }

export default class Node extends React.Component<any, any> {
  private container;

  // componentWillAppear(callback) {
  //   console.log("this crap will appear!");
  //   const el = this.container;
  //   callback();
  //   // TweenMax.fromTo(el, 0.5, {attr: {d: calc(this.props.data)}}, {attr: {d: p.linkDestTransform(this.props.data)}, onComplete: callback});
  // }

  // componentWillUpdate(nextProps) {
  //   // console.log(`link ${this.props.data.data.name} entering`);
  //   // callback();
  //   const el = this.container;
  //   TweenMax.to(el, 0.75, {attr: {d: p.linkDestTransform(nextProps.data)}});
  // }

  // componentWillEnter (callback) {
  //   console.log(`link ${this.props.data.data.name} entering`);
  //   // callback();
  //   const el = this.container;
  //   TweenMax.fromTo(el, 0.3, {attr: {d: calc(this.props.data)}}, {attr: {d: p.linkDestTransform(this.props.data)}, onComplete: callback});
  // }

  // componentWillLeave (callback) {
  //   console.warn(`link ${this.props.data.data.name} leaving`);
  //   console.warn(`from ${p.linkDestTransform(this.props.data)} to ${calc(this.props.data)}`);
  //   // callback();
  //   const el = this.container;
  //   TweenMax.fromTo(el, 0.75, {attr:{d: p.linkDestTransform(this.props.data)}, opacity: 1}, {attr:{d: calc(this.props.data)}, opacity: 0, onComplete: callback});
  // }
  onCircleClick() {
    const node = this.props.node;
    this.props.onNodeClick(node);
  }

  onTextClick() {
    const node = this.props.node;
    this.props.onTextClick(node);
  }

  onDragStart() {
    console.log(`starting to drag node ${this.props.node.data.name}`);
  }

  onDragEnd() {
    console.log(`ending drag on ${this.props.node.data.name}`);
  }

  onDragOver() {
    console.log('dragging over');
  }

  render () {
    const { node, display } = this.props;
    const x = node.children ? - 8 : 8;
    const nodeClassName = node.children ? 'internal' : 'leaf';
    const nodeName = node.data.name;
    const nodeDestTransform = graphProcessor[display].nodeDestTransform;
    const linkDestTransform = graphProcessor[display].linkDestTransform;

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} transform={nodeDestTransform(node)}>
        <circle r={20} className="ghost disabled" />
        <circle r={15} className="inner" draggable onDragStart={this.onDragStart.bind(this)} onDragEnd={this.onDragEnd.bind(this)} onDragOver={this.onDragOver.bind(this)} />
        <text dy={3} x={x} className={nodeClassName} onClick={this.onTextClick.bind(this)}>{nodeName}</text>
      </g>
    );
  }
}

   // stick in DOM
    // const sourceTransform = `translate(${source.x}, ${source.y})`;
    // const nodeDestTransform = graphProcessor[display].nodeDestTransform;
    // const linkDestTransform = graphProcessor[display].linkDestTransform;

    // enterNodes
    //   .attr('transform', sourceTransform )
    //   .attr('style', 'fill-opacity: 1e-6')
    //   .merge(nodes)
    //   .transition(transitionBehavior)
    //   .attr('class', (d:d3Node) => {
    //     const className = d.children ? 'internal': 'leaf';
    //     return `node ${className}`;
    //   })
    //   .attr('transform', nodeDestTransform)
    //   .attr('style', 'fill-opacity: 1')
    //   .on('end', attachBehaviors);

    // const exitNodes = nodes.exit()
    //   .transition(transitionBehavior)
    //   .attr('transform', sourceTransform)
    //   .attr('style', 'fill-opacity: 1e-6')
    //   .remove();

  //  const enterNodes = nodes.enter().append('g').attr('id', d => d.data.id);

  //   enterNodes.append('circle')
  //     .attr('r', 7.5)
  //     .attr('class', 'inner');

  //   enterNodes.append('circle')
  //     .attr('r', 20)
  //     .attr('class', 'ghost disabled')
  //     .attr('pointerEvents', 'mouseover')
  //     .on('mouseover', function(node) {
  //       self.props.onMouseOver(node, this);
  //     })
  //     .on('mouseout', function(node) {
  //       self.props.onMouseOut(node, this);
  //     });

            // nodeContainer.append('text')
            // .attr('dy', 3)
            // .attr('x', (d: d3Node) => d.children ? -8 : 8)
            // .attr('class', (d: d3Node) => d.children ? 'internal': 'leaf')
            // .text(_ => {
            //   return node.data.name;
            // });
