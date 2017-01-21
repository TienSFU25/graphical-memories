import * as React from 'react';
import { PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-bootstrap';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

interface IProps {
  className: string;
  onTransitionEnd: any;
  reflow: boolean;
}

export default class ClassBag extends React.Component<IProps, any> {
  private thingy;

  _onTransitionEnd(e) {
    if (e.target == this.thingy) {
      this.props.onTransitionEnd(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reflow) {
      // console.log('reflowing!');
      this.thingy.offsetWidth;
      // this.forceUpdate();
    }

    // this.updateClassNames();
  }

  render() {
    // const className = Array.from(this.state.classNames).join(' ');

    return (
      <div className={this.props.className} ref={(d) => { this.thingy = d; }} onTransitionEnd={this._onTransitionEnd.bind(this)}>
        <Row>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png" />
                </a>
            </Col>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png" />
                </a>
            </Col>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                </a>
            </Col>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png" />
                </a>
            </Col>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png" />
                </a>
            </Col>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
                </a>
            </Col>
        </Row>
      </div>
    );
  }
};
