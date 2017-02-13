import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

export default class Page extends React.Component<any, any> {
  state = {
    shouldShowBox: true
  };

  toggleBox = () => {
    this.setState({
      shouldShowBox: !this.state.shouldShowBox
    });
  };

  render () {
    return <div className="page">
      <TransitionGroup>
        { this.state.shouldShowBox && <Box />}
      </TransitionGroup>
      <button
        className="toggle-btn"
        onClick={this.toggleBox}
      >
        toggle
      </button>
    </div>;
  }
}

class Box extends React.Component<any, any> {
  private container;
  componentWillEnter (callback) {
    console.log('box entering bitch');
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 100, opacity: 0}, {y: 0, opacity: 1, onComplete: callback});
  }

  componentWillLeave (callback) {
    console.log('box leaving BITCH');
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 0, opacity: 1}, {y: -100, opacity: 0, onComplete: callback});
  }

  render () {
    return <div className="box" ref={c => this.container=c}>Im the box bitch</div>;
  }
}
