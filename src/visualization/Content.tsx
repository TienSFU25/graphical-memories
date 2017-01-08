import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import TreeManager from './TreeManager';

import '../css/app.scss';

class Content extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      tree: null
    };
  }

  componentDidMount() {
    let tree = new TreeManager('#chart', this.props.actions.selectNode)

    this.setState({
      tree
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('setting data on tree...');
    let graphData = nextProps.rawGraph;
    this.state.tree.setData(graphData);
  }

  render() {
    return (
      <div>
        <div>This is for d3</div>
        <div id="chart"></div>
      </div>
    );
  }
};

function mapStateToProps({ rawGraph }) {
  return {
    rawGraph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
