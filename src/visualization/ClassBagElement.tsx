import * as React from 'react';
import { PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-bootstrap';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

interface IProps {
  classAdds?: Array<string>;
  classRemoves?: Array<string>;
  onTransitionEnd: any;
  reflow: boolean;
}

interface IState {
  classNames: Set<string>;
}

export default class ClassBag extends React.Component<IProps, IState> {
  private thingy;

  constructor(props) {
    super(props);

    let classNames = new Set();

    for (let addClass of this.props.classAdds || []) {
      classNames.add(addClass);
    }

    for (let removeClass of this.props.classRemoves || []) {
      classNames.delete(removeClass);
    }

    this.state = {
      classNames
    };
  }

  updateClassNames() {
    let classNames = this.state.classNames;

    for (let addClass of this.props.classAdds || []) {
      classNames.add(addClass);
    }

    for (let removeClass of this.props.classRemoves || []) {
      classNames.delete(removeClass);
    }

    this.setState({
      classNames
    });
  }

  _onTransitionEnd(e) {
    if (e.target == this.thingy) {
      console.log('transition ended in child element!');
      this.props.onTransitionEnd(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reflow) {
      console.log('reflowing!');
      console.log(this.thingy.offsetWidth);
    }

    this.updateClassNames();
  }

  render() {
    const className = Array.from(this.state.classNames).join(' ');

    return (
      <div className={className} ref={(d) => { this.thingy = d; }} onTransitionEnd={this._onTransitionEnd.bind(this)}>
        <Row>
            <Col sm={2}>
                <a href="#x" className="thumbnail">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png" />
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
    );
  }
};

// export default ClassBag;
