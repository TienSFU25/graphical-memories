import * as React from 'react';
import Network from '../network/Network';
import Visualizer from '../visualization/Content';
import {Jumbotron} from 'react-bootstrap';

interface HomePageProps {}
interface HomePageState {}

class HomePage extends React.Component<HomePageProps, HomePageState> {
  render() {
    return (
      <div>
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Network />
        <Visualizer />
      </div>
    );
  }
}

export default HomePage;
