import * as React from 'react';
import { Col, Row, Jumbotron} from 'react-bootstrap';

import GraphMetadata from '../graphMetadata/GraphMetadata';
import Visualizer from '../visualization/Content';

interface HomePageProps {}
interface HomePageState {}

class HomePage extends React.Component<HomePageProps, HomePageState> {
  render() {
    return (
      <div>
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Row>
          <Col sm={9}>
            <Visualizer />
          </Col>
          <Col sm={3}>
           {/* <GraphMetadata /> */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
