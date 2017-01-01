import * as React from 'react';
import Network from '../network/Network';
import {Jumbotron} from 'react-bootstrap';

interface HomePageProps {}
interface HomePageState {}

class HomePage extends React.Component<HomePageProps, HomePageState> {
  render() {
    return (
      <div>
        <Jumbotron>
          <h3>This is my homepage!</h3>
        </Jumbotron>
        <Network />
      </div>
    );
  }
}

export default HomePage;
