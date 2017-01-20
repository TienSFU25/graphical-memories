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

export default class AxisManager extends React.Component<any, any> {
  private width: number;
  private height: number;
  private g;
  private scrollable;
  private leftButton;
  private rightButton;
  private carousel;
  // private children;
  private active;

  constructor(props) {
    super(props);

    const children = [
      // <ClassBagElement outerClassName="item active" onTransitionEnd={this.transitionEnd.bind(this)} />,
      // <ClassBagElement outerClassName="item" onTransitionEnd={this.transitionEnd.bind(this)} />
      {
        classAdds: ['item', 'active']
      },
      {
        classAdds: ['item']
      }
    ];

    this.active = [1, 0];

    this.state = {
      hasInitialized: false,
      g: null,
      numberOfTransitionedChildren: 0,
      children
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

    // let numberOfTransitionedChildren = this.state.numberOfTransitionedChildren + 1;

    // if (numberOfTransitionedChildren == this.state.children.length) {
    //   numberOfTransitionedChildren = 0;
    //   this.setState({children: [
    //     {
    //       classRemoves: ['active', 'left']
    //     },
    //     {
    //       classAdds: ['next', 'left'],
    //       classRemoves: ['active']
    //     }
    //   ],
    //   numberOfTransitionedChildren: numberOfTransitionedChildren});
    // }
    if (e.target && e.target.classList && e.target.classList.contains('active')) {
      this.setState({children: [
        {
          classRemoves: ['active', 'left']
        },
        {
          classAdds: ['next', 'left'],
          classRemoves: ['active']
        }
      ]});
      console.log('transition carousel!');
    }

  }

  _onClickNext(e) {
    e.preventDefault();
    this.setState({children: [
      {
        classAdds: ['left']
      },
      {
        classAdds: ['next']
      }
    ]}, renderAgain.bind(this));

    function renderAgain() {
        this.setState({
          children: [
            {
            },
            {
              classAdds: ['left'],
              reflow: true
            }
        ]
      })
    };

    console.log('next was clicked!');
  }

  toClassBag(child) {
    // const childClassName = child.classNames.join(' ');
    return <ClassBagElement classAdds={child.classAdds} classRemoves={child.classRemoves} onTransitionEnd={this.transitionEnd.bind(this)} reflow={child.reflow} />
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
                {this.state.children.map(this.toClassBag.bind(this))}
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
