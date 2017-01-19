import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import Graph from './Graph';

import '../css/app.scss';

export default class Content extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>This is for d3</div>
        <Graph />
      </div>
    );
  }
};
