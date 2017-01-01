import * as React from 'react';
import Network from './Network';
import {connect} from 'react-redux';
import {Jumbotron} from 'react-bootstrap';

class HomePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

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
