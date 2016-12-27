import React, {PropTypes} from 'react';
// import Header from './common/Header';
import Network from './Network';
import {connect} from 'react-redux';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="jumbotron">This is my homepage!</div>
        <Network />
      </div>
    );
  }
}

export default HomePage;
