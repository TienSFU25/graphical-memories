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
  images: Array<string>;
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
      this.thingy.offsetWidth;
    }
  }

  _toThumbnail(imageHref) {
    return(
      <Col sm={2}>
          <a href="#x" className="thumbnail">
            <img src={imageHref} />
          </a>
      </Col>
    );
  }

  render() {
    // const className = Array.from(this.state.classNames).join(' ');

    return (
      <div className={this.props.className} ref={(d) => { this.thingy = d; }} onTransitionEnd={this._onTransitionEnd.bind(this)}>
        <Row>
          {this.props.images.map(this._toThumbnail.bind(this))}
        </Row>
      </div>
    );
  }
};
