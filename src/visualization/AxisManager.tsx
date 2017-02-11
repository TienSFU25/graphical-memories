import * as d3 from 'd3';
import * as React from 'react';
import { Grid, Row, Col, FormGroup } from 'react-bootstrap';
import { HotKeys } from 'react-hotkeys';

import ClassBagElement from './ClassBagElement';
import Loader from '../shared/Loader';
import InputField from '../shared/InputField';
import CarouselItem from './CarouselItem';

import '../css/carousel.css';

const MAX_LENGTH = 6;

export default class AxisManager extends React.Component<any, any> {
  private activeIndex;
  private prevIndex;
  private isGoingNext;
  private hasJustLoadedImages: boolean = false;
  private _handlers;

  constructor(props) {
    super(props);

    this.state = {
      searchBoxValue: '',
      images: [],
      carousel: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imageList !== nextProps.imageList && nextProps.imageList && nextProps.imageList.length > 0) {
      // initialize carousel
      const IMAGES = nextProps.imageList;
      const carousel = new Array<CarouselItem>();

      for (let i = 0; i < IMAGES.length; i+= MAX_LENGTH) {
        const imgSlice = IMAGES.slice(i, i + MAX_LENGTH);
        const carouselItem = new CarouselItem(imgSlice);
        carousel.push(carouselItem);
      }

      this.activeIndex = 0;
      this.prevIndex = 2;
      carousel[this.activeIndex].addClasses('active');

      // code smell
      this.hasJustLoadedImages = true;
      this.setState({
        images: IMAGES,
        carousel
      });
    }
  }

  componentDidUpdate() {
    if (this.props.dragBehavior !== undefined && this.hasJustLoadedImages) {
      // attach drag data and behavior to images
      const imagesWithDescriptor = this.state.images.map((image) => {
        return {
          type: 'IMAGE',
          href: image
        };
      });

      d3.select('.my-carousel').selectAll('img').data(imagesWithDescriptor);
      d3.select('.my-carousel').selectAll('img').call(this.props.dragBehavior);
      this.hasJustLoadedImages = false;
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
    this.isGoingNext = true;
    this._update();
  }

  _onClickPrev(e) {
    this.isGoingNext = false;
    this._update();
  }

  _getTypeAndDirection() {
    return this.isGoingNext ? ['next', 'up'] : ['prev', 'down'];
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

  onChange(searchBoxValue) {
    this.setState({
      searchBoxValue
    });
  }

  getHandlersInstance() {
    if (this._handlers) return this._handlers;

    const self = this;

    const handlers = {
      'tab': (e) => {
        e.preventDefault();
        self.props.onSearch(self.state.searchBoxValue);
      }
    };

    this._handlers = handlers;
    return handlers;
  }

  toClassBag(carouselItem: CarouselItem) {
    return <ClassBagElement className={carouselItem.getClassName()} images={carouselItem.getImages()} reflow={carouselItem.reflow} onTransitionEnd={this.transitionEnd.bind(this)}/>
  }

  render() {
    let CarouselContents;

    if (this.state.carousel.length > 0) {
      CarouselContents = this.state.carousel.map(this.toClassBag.bind(this));
    } else {
      CarouselContents = <Loader />;
    }

    return (
      <div>
        <HotKeys handlers={this.getHandlersInstance()} >
          <FormGroup>
            <InputField className='form-control' onChange={this.onChange.bind(this)} placeholder="Search..." />
          </FormGroup>
        </HotKeys>
        <div className="my-carousel slide" >
            <div className="my-carousel-inner">
              {CarouselContents}
            </div>
            <a className="up my-carousel-control" role="button" onClick={this._onClickPrev.bind(this)} >
              <span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="down my-carousel-control" role="button" onClick={this._onClickNext.bind(this)} >
              <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
      </div>
    );
  }
}
