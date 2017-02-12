import * as React from 'react';
// import { Col, Row, Jumbotron } from 'react-bootstrap';

import Header from './Header';
import Visualizer from '../visualization/Graph';
import InputWrapper from '../popups/InputWrapper';

import '../css/app.scss';
import '../css/edit.scss';

class HomePage extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Header />
        <Visualizer />
      </div>
    );
  }
}

export default HomePage;
