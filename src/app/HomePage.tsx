import * as React from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';

import Visualizer from '../visualization/Graph';
import InputWrapper from '../popups/InputWrapper';

import '../css/app.scss';

class HomePage extends React.Component<any, any> {
  render() {
    return (
      <div>
        <InputWrapper />
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Row>
          <Col sm={12}>
            <Visualizer />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
