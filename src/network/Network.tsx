import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-bootstrap';
import * as vis from 'vis';

import { NetworkData } from '../types';
import graphManipulationActions from './graphManipulationActions';
import loadGraphFromString from './loadGraphActions';
import SelectedEntity from './SelectedEntity';
import SaveButton from './SaveButton';
// import LoadButton from './LoadButton';
import DataPanel from './DataPanel';

import '../../node_modules/vis/dist/vis.css';
import '../css/app.scss';

interface INetworkProps {
  networkData: NetworkData,
  showEditPopup: boolean,
  loadGraphActions: any,
  actions: any
}

class Network extends React.Component<INetworkProps, any> {
  networkContainer: any;

  constructor(props) {
    super(props);

    this.state = {
      network: null
    }
  }

  componentDidMount() {
    const network = new vis.Network(this.networkContainer, [], {});

    let options = {
      interaction: {dragNodes: true},
      physics: {
          enabled: false
      },
      manipulation: {
        addNode: (nodeData: vis.Node, callback) => {
          this.props.actions.addNode(nodeData, callback);
        },
        editNode: (nodeData: vis.Node, callback) => {
          console.log('implement this edit node bitch!');
        }
      }
    };

    network.setOptions(options);

    network.on('click', (params) => {
      this.props.actions.selectEntity(params, network);
    });

    network.on('dragEnd', (params) => {
      // assume only the node got dragged for now
      let id = params.nodes[0];

      this.props.actions.selectNode(id, network);
    });

    this.props.actions.initializeNetworkSuccess(network);

    this.setState({
      network: network
    });
  }

  componentWillReceiveProps(nextProps: INetworkProps) {
    if (nextProps.networkData.isFresh) {
      this.state.network.setData({
        nodes: nextProps.networkData.nodes,
        edges: nextProps.networkData.edges
      });
    }
  }

  onSave() {
    this.state.network.storePositions();
  }

  onDataUpdate(event: React.SyntheticEvent<any>) {
    var newData = event.currentTarget.value;

    this.props.loadGraphActions.loadGraphFromString(newData);
  }

  render() {
    return (
      <div>
        <div>This is the network</div>
        <Row>
          <Col xs={7} md={7}>
            <div ref={(thisDiv) => this.networkContainer = thisDiv} id="mynetwork"/>
          </Col>
          <Col xs={5} md={5}>
            <SaveButton onClick={this.onSave.bind(this)} />
            <SelectedEntity />
            <DataPanel networkData={this.props.networkData} onChange={this.onDataUpdate.bind(this)} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkData: state.networkData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    loadGraphActions: bindActionCreators(loadGraphFromString, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
