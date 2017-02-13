import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

import { d3Node } from '../types';
import graphProcessor from './graphProcessor';

const p = graphProcessor[0];
// export default class Wrapper extends React.Component<any, any> {
//   constructor(props) {
//     super(props);
//   }

//   calc(d: d3Node) {
//     const source = this.props.source;

//     return `M${source.x},${source.y}`
//       + `C${source.x},${source.y}`
//       + ` ${source.x},${source.y}`
//       + ` ${source.x},${source.y}`
//   }

//   render () {
//     const pathy = <Link key={this.props.data.data.id} {...this.props}/>;

//     return (
//       <TransitionGroup component="g">
//         {pathy}
//       </TransitionGroup>
//     );
//   }
// }
function calc(d) {
    // const source = this.props.source;

    return `M${d.parent.x},${d.parent.y}`
      + `C${d.parent.x},${d.parent.y}`
      + ` ${d.parent.x},${d.parent.y}`
      + ` ${d.parent.x},${d.parent.y}`
  }

export default class Link extends React.Component<any, any> {
  private container;

  componentDidAppear() {
    // console.log("this crap appeared!");
    // callback();
  }

  componentWillAppear(callback) {
    // console.log("this crap will appear!");
    const el = this.container;
    callback();
    // console.warn(`from ${calc(this.props.data)} to ${p.linkDestTransform(this.props.data)}`);
    // TweenMax.fromTo(el, 3, {attr: {d: calc(this.props.data)}}, {attr: {d: p.linkDestTransform(this.props.data)}, onComplete: callback});
  }

  // componentDidEnter() {
  //   console.log('entered');
  // }

  componentWillUpdate(nextProps) {
    // console.log(`link ${this.props.data.data.name} updating`);
    // console.warn(`to ${p.linkDestTransform(nextProps.data)}`);
    // callback();
    const el = this.container;
    TweenMax.to(el, 0.75, {attr: {d: p.linkDestTransform(nextProps.data)}});
  }

  componentWillEnter (callback) {
    console.log(`link ${this.props.data.data.name} entering`);
    // callback();
    const el = this.container;
    TweenMax.fromTo(el, 0.75, {attr: {d: calc(this.props.data)}}, {attr: {d: p.linkDestTransform(this.props.data)}, onComplete: callback});
  }

  componentWillLeave (callback) {
    console.warn(`link ${this.props.data.data.name} leaving`);
    console.warn(`from ${p.linkDestTransform(this.props.data)} to ${calc(this.props.data)}`);
    // callback();
    const el = this.container;
    TweenMax.fromTo(el, 0.75, {attr:{d: p.linkDestTransform(this.props.data)}, opacity: 1}, {attr:{d: calc(this.props.data)}, opacity: 0, onComplete: callback});
  }

  // componentDidLeave() {
  //   console.log('leaving :|');
  // }

  render () {
    return (
      <path className="link" ref={c => this.container=c} />
    );
  }
}

    // const links = context.selectAll('.link')
    //   .data(root.descendants().slice(1), d => d.data.id);

    // const enterLinks = links.enter()
    //   .insert('path', 'g')
    //   .attr('d', (d: d3Node) => {
    //       return `M${source.x},${source.y}`
    //         + `C${source.x},${source.y}`
    //         + ` ${source.x},${source.y}`
    //         + ` ${source.x},${source.y}`
    //   })
    //   .merge(links)
    //   .transition(transitionBehavior)
    //   .attr('class', 'link')
    //   .attr('d', linkDestTransform);

    // const exitLinks = links.exit()
    //   .transition(transitionBehavior)
    //   .attr('d', d => {
    //     return `M${source.x},${source.y}`
    //       + `C${source.x},${source.y}`
    //       + ` ${source.x},${source.y}`
    //       + ` ${source.x},${source.y}`
    //   })
    //   .remove();
