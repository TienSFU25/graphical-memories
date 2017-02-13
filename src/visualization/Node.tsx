import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import * as d3 from 'd3';
import { TweenMax } from 'gsap';
import { DragSource, DropTarget } from 'react-dnd';

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
  private circ;
  private ghostCirc;

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

  // dragBehavior: d3.DragBehavior<any, any, any>;
  // onClick: Function;
  // onTextClick: Function;
  // onMouseOver: Function;
  // onMouseOut: Function;

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
    const { node, display } = this.props;
    const x = node.children ? - 8 : 8;
    const nodeClassName = node.children ? 'internal' : 'leaf';
    const nodeName = node.data.name;
    const nodeDestTransform = graphProcessor[display].nodeDestTransform;
    const linkDestTransform = graphProcessor[display].linkDestTransform;

    return (
      <g id={node.data.id} className={`node ${nodeClassName}`} transform={nodeDestTransform(node)}>
        <circle r={20} className="ghost disabled" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} ref={c => this.ghostCirc = c}/>
        <circle r={7.5} className="inner" ref={c => this.circ = c} />
        <text dy={3} x={x} className={nodeClassName} onClick={this.onTextClick.bind(this)}>{nodeName}</text>
      </g>
    );
  }
}

    // this.dragBehavior = d3.drag()
    //   .on('start', d => {
    //     // d3.selectAll('.ghost.disabled').attr('class', 'ghost');
    //     d3.event.sourceEvent.stopPropagation();
    //   })
    //   .on('drag', (d) => {
    //     const e = d3.event;
    //     if (e.x - d['x']  > DRAG_THRESHOLD || e.y - d['y'] > DRAG_THRESHOLD || d['type'] === 'IMAGE') {
    //       self.isDragging = true;
    //       d3.selectAll('.ghost.disabled').attr('class', 'ghost');
    //     }
    //   })
    //   .on('end', d => {
    //     if (self.isDragging) {
    //       console.log('drag ended');

    //       d3.selectAll('.ghost').attr('class', 'ghost disabled');

    //       // fix this yolo code plz
    //       if (d['type'] == 'IMAGE') {
    //         this.props.actions.attachImageToNode(d['href'], self.destDragNode);
    //       }
    //       else if (self.destDragNode && d['data'].id !== self.destDragNode.data.id) {
    //         console.log(`moving ${d['data'].id} to ${self.destDragNode.data.id}`)
    //         self.props.actions.moveNode(d,  );
    //       }

    //       self.destDragNode = null;
    //     } else {
    //       // assume a click event
    //       // handled by another handler
    //       console.log('assume you clicked!');
    //     }

    //     self.isDragging = false;
    //   });



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
