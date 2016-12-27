import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import jsonToVisNetwork from '../dataMappers/jsonToVisNetwork';
import visCss from '../../node_modules/vis/dist/vis.css';
import * as graphManipulationActions from '../actions/graphManipulationActions';
import * as vis from 'vis';

class Network extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   nodes: new vis.DataSet([]),
    //   edges: new vis.DataSet([])
    // };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // var shouldUpdate = this.state.nodes.length !== nextState.nodes.length;
    // debugger;

    // return shouldUpdate;
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // debugger;
    // let container = this.network;

    // let options = {
    //   manipulation: true
    // };

    // let visDataSet = {
    //   nodes: nextState.nodes,
    //   edges: nextState.edges
    // };

    // var that = this;

    // let network = new vis.Network(container, visDataSet, {
    //   manipulation: {
    //     addNode: (nodeData, callback) => {

    //       let oldVisNodes= this.state.nodes;
    //       this.props.actions.addNode(nodeData, callback);
    //       debugger;
    //       // this.setState({
    //       //   visDataSet: oldVisDataSet
    //       // });
    //     },
    //     editNode: (nodeData, callback) => {
    //       console.log(nodeData);
    //     }
    //   }
    // });
  }

  componentWillReceiveProps(nextProps) {
    // debugger;
    if (nextProps) {
      let container = this.network;

      let options = {
        manipulation: true
      };

      let network = new vis.Network(container, nextProps.graph, {
        manipulation: {
          addNode: (nodeData, callback) => {
            this.props.actions.addNode(nodeData, callback);
            debugger;
            // this.setState({
            //   visDataSet: oldVisDataSet
            // });
          },
          editNode: (nodeData, callback) => {
            console.log(nodeData);
          }
        }
      });
    }
  }

  render() {
    return (
      <div>
        <div>This is the network</div>
        <div ref={(thisDiv) => this.network = thisDiv} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let graph = state.graph;
  // let visNetworkData = jsonToVisNetwork(graph);

  return {
    graph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
