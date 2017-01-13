import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import Graph from './Graph';
import AxisManager from './AxisManager';

import '../css/app.scss';

export default class Content extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      axis: null
    };
  }

  componentDidMount() {
    let axis = new AxisManager('#axis');

    this.setState({
      axis
    });
  }

  render() {
    return (
      <div>
        <div>This is for d3</div>
        <div id="axis"></div>
        <Graph />
      </div>
    );
  }
};
