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

const MAX_LENGTH = 6;
const IMAGES = [
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
  "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png"
];

class CarouselItem {
  private classNames: Set<string>;
  private imageList: Array<string>;
  public reflow: boolean;

  constructor(images?: Array<string>) {
    this.classNames = new Set<string>();
    this.classNames.add('item');
    this.reflow = false;
    this.imageList = [];
    this.addImages(images);
  }

  addImages(images) {
    if (images) {
      this.imageList = this.imageList.concat(images);
    }
  }

  getImages() {
    return this.imageList;
  }

  addClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.classNames.add(c);
    }
  }

  removeClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.classNames.delete(c);
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
  private isGoingRight;
  private hasInitialized: boolean = false;

  constructor(props) {
    super(props);

    // initialize carousel
    const carousel = new Array<CarouselItem>();

    for (let i = 0; i < IMAGES.length; i+= MAX_LENGTH) {
      const imgSlice = IMAGES.slice(i, i + MAX_LENGTH);
      const carouselItem = new CarouselItem(imgSlice);
      carousel.push(carouselItem);
    }

    this.activeIndex = 0;
    this.prevIndex = 2;
    carousel[this.activeIndex].addClasses('active');

    this.state = {
      // hasInitialized: false,
      g: null,
      carousel
      // children
    };
  }

  shouldComponentUpdate(nextState) {
    return (!nextState.hasInitialized);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dragBehavior !== undefined && !this.hasInitialized) {
      // attach drag data and behavior to images
      const imagesWithDescriptor = IMAGES.map((image) => {
        return {
          type: 'IMAGE',
          href: image
        };
      });

      d3.select('#myCarousel').selectAll('img').data(imagesWithDescriptor);
      d3.select('#myCarousel').selectAll('img').call(nextProps.dragBehavior);
      this.hasInitialized = true;
    }
  }

  transitionEnd(e) {
    const [type, direction] = this._getTypeAndDirection();

    if (e.target && e.target.classList && e.target.classList.contains('active') && !this.state.hasTransitionEnded) {
      console.log('transition carousel!');
      const nextCarousel = Object.assign([], [...this.state.carousel]);
      nextCarousel[this.activeIndex].addClasses('active');
      nextCarousel[this.activeIndex].removeClasses(type, direction);
      nextCarousel[this.prevIndex].removeClasses('active', direction);

      this.setState({
        carousel: nextCarousel,
        hasTransitionEnded: true
      });
    }

  }

  _onClickNext(e) {
    e.preventDefault();
    this.isGoingRight = true;
    this._update();
  }

  _onClickPrev(e) {
    e.preventDefault();
    this.isGoingRight = false;
    this._update();
  }

  _getTypeAndDirection() {
    return this.isGoingRight ? ['next', 'left'] : ['prev', 'right'];
  }

  _update() {
    const [type, direction] = this._getTypeAndDirection();
    const oldActiveIndex = this.activeIndex;
    this.activeIndex = (oldActiveIndex + 1) % this.state.carousel.length;
    this.prevIndex = oldActiveIndex;

    const nextCarousel = Object.assign([], [...this.state.carousel]);
    nextCarousel[this.activeIndex].addClasses(type);
    nextCarousel[this.prevIndex].addClasses(direction);

    this.setState({
      carousel: nextCarousel
    }, renderAgain.bind(this));

    function renderAgain() {
      const nextCarousel = Object.assign([], [...this.state.carousel]);
      nextCarousel[this.activeIndex].addClasses(direction);
      nextCarousel[this.activeIndex].reflow = true;

      this.setState({
        carousel: nextCarousel,
        hasTransitionEnded: false
      });
    }
  }

  toClassBag(carouselItem: CarouselItem) {
    return <ClassBagElement className={carouselItem.getClassName()} images={carouselItem.getImages()} reflow={carouselItem.reflow} onTransitionEnd={this.transitionEnd.bind(this)}/>
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
              <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev" onClick={this._onClickPrev.bind(this)} >
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
