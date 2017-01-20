import * as d3 from 'd3';
import * as React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

// import '../../node_modules/jquery/dist/jquery';
// import '../../node_modules/bootstrap/dist/js/bootstrap';

import './carousel.css';
global['$'] = require('jquery');
global['jQuery'] = require('jquery');

var Carousel = require('./carousel.js');
// import '../../node_modules/bootstrap/dist/js/bootstrap';

// window['caru'] = Carousel;

export default class AxisManager extends React.Component<any, any> {
  private width: number;
  private height: number;
  private g;
  private scrollable;
  private leftButton;
  private rightButton;
  private carousel;

  constructor(props) {
    super(props);

    this.state = {
      hasInitialized: false,
      g: null
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
    window['lefty'] = this.leftButton;
    if (e.target == this.leftButton) {
      console.log('dit me het me transition left!');
    }

    if (e.target == this.rightButton) {
      console.log('dit me het me transition right!');
    }

    if (e.target == this.carousel) {
      console.log('dit me het me transition carousel!');
    }
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
                  <div className="item active" onTransitionEnd={this.transitionEnd.bind(this)} ref={(d) => this.carousel = d}>
                      <Row>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                      </Row>
                  </div>
                  <div className="item">
                      <Row>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                          <Col sm={2}>
                              <a href="#x" className="thumbnail">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                              </a>
                          </Col>
                      </Row>
                  </div>
              </div>
              <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev" ref={(d) => this.leftButton = d} >
                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next" ref={(d) => this.rightButton = d}>
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
