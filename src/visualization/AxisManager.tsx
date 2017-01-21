import * as d3 from 'd3';
import * as React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

import ClassBagElement from './ClassBagElement';

// import '../../node_modules/jquery/dist/jquery';
// import '../../node_modules/bootstrap/dist/js/bootstrap';

import './carousel.css';
global['$'] = require('jquery');
global['jQuery'] = require('jquery');

var Carousel = require('./carousel.js');
// import '../../node_modules/bootstrap/dist/js/bootstrap';

// window['caru'] = Carousel;

class CarouselItem {
  private classNames: Set<string>;
  public reflow: boolean;

  constructor(...items) {
    this.classNames = new Set<string>();
    this.reflow = false;
    this.addClasses(...items);
  }

  addClass(c: string): void {
    this.classNames.add(c);
  }

  addClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.addClass(c);
    }
  }

  removeClass(c: string): void {
    this.classNames.delete(c);
  }

  removeClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.removeClass(c);
    }
  }

  getClassName(): string {
    return ([...this.classNames]).join(' ');
  }
}

export default class AxisManager extends React.Component<any, any> {
  private width: number;
  private height: number;
  private g;
  private scrollable;
  private leftButton;
  private rightButton;
  private activeIndex;
  private prevIndex;

  constructor(props) {
    super(props);

    // initialize carousel
    const nElements = 3;
    const carousel = new Array<CarouselItem>();

    for (let i = 0; i < nElements; i++) {
      carousel.push(new CarouselItem('item'));
    }

    this.activeIndex = 0;
    this.prevIndex = 2;
    carousel[this.activeIndex].addClass('active');

    this.state = {
      hasInitialized: false,
      g: null,
      carousel
      // children
    };
  }

  shouldComponentUpdate(nextState) {
    return (!nextState.hasInitialized);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.container !== undefined) {
      this.setState({
        g: nextProps.container.append('g'),
        hasInitialized: true
      });
    }
  }

  transitionEnd(e) {
    // window['lefty'] = this.leftButton;
    // if (e.target == this.refs[0]) {
    // }

    // let numberOfTransitionedChildren = this.state.numbe

    if (e.target && e.target.classList && e.target.classList.contains('active') && !this.state.hasTransitionEnded) {
      console.log('transition carousel!');
      const nextCarousel = Object.assign([], [...this.state.carousel]);
      nextCarousel[this.activeIndex].addClass('active');
      nextCarousel[this.activeIndex].removeClasses('next', 'left');
      nextCarousel[this.prevIndex].removeClasses('active', 'left');

      this.setState({
        carousel: nextCarousel,
        hasTransitionEnded: true
      });
    }

  }

  _onClickNext(e) {
    e.preventDefault();
    const oldActiveIndex = this.activeIndex;
    this.activeIndex = (oldActiveIndex + 1) % this.state.carousel.length;
    this.prevIndex = oldActiveIndex;

    const nextCarousel = Object.assign([], [...this.state.carousel]);
    nextCarousel[this.activeIndex].addClass('next');
    nextCarousel[this.prevIndex].addClass('left');

    this.setState({
      carousel: nextCarousel
    }, renderAgain.bind(this));

    function renderAgain() {
      const nextCarousel = Object.assign([], [...this.state.carousel]);
      nextCarousel[this.activeIndex].addClass('left');
      nextCarousel[this.activeIndex].reflow = true;

      this.setState({
        carousel: nextCarousel,
        hasTransitionEnded: false
      });
    }
  }

  toClassBag(carouselItem: CarouselItem) {
    return <ClassBagElement className={carouselItem.getClassName()} reflow={carouselItem.reflow} onTransitionEnd={this.transitionEnd.bind(this)}/>
  }

  render() {
    if (this.state.g) {
      this.update();
    }

    return (
      <Grid>
        <Row>
          <div id="myCarousel" className="carousel slide" data-interval="false" data-ride="carousel">
              <ol className="carousel-indicators">
                  <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                  <li data-target="#myCarousel" data-slide-to="1"></li>
              </ol>
              <div className="carousel-inner">
                {this.state.carousel.map(this.toClassBag.bind(this))}
              </div>
              <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev" ref={(d) => this.leftButton = d} >
                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next" onClick={this._onClickNext.bind(this)} >
                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </Row>
      </Grid>
    );
  }

  update() {
    // const img = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png";
    // const imgs = [img, img, img, img, img, img, img, img];

    // d3.selectAll('.thumbnail')
    //   .selectAll('img')
    //   .data(imgs)
    //   .enter()
    //   .append('img')
    //   .attr('src', d => d)
    //   .attr('alt', 'Image');
  }
}
