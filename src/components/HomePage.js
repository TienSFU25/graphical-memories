import React, {PropTypes} from 'react';
// import Header from './common/Header';
import {connect} from 'react-redux';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localMsg: 'sup bitch'
    };
  }

  render() {
    return (
      <div>
        <div>This is my {this.state.localMsg} homepage!</div>
        <div>This is my {this.props.message} homepage!</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.hello
  };
}

export default connect(mapStateToProps)(HomePage);
