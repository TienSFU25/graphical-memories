import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../node_modules/vis/dist/vis.css';
import '../css/app.scss';
import graphManipulationActions from '../actions/graphManipulationActions';
import * as vis from 'vis';
import SelectedEntity from './SelectedEntity';
import {Row, Col} from 'react-bootstrap';

interface INetworkState {
  network: vis.Network
}

interface INetworkProps {
  networkData: any,
  actions: any
}

class Network extends React.Component<INetworkProps, INetworkState> {
  networkContainer: any;

  constructor(props) {
    super(props);

    this.state = {
      network: null
    }
  }

  static propTypes = {
    actions: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    let options = {
      interaction: {dragNodes: true},
      physics: {
          enabled: false
      },
      manipulation: {
        addNode: (nodeData, callback) => {
          this.props.actions.addNode(nodeData, callback);
        },
        editNode: (nodeData, callback) => {
          callback(nodeData);
        }
      }
    };

    const network = new vis.Network(this.networkContainer, [], options);

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.networkData.isFresh) {
      this.state.network.setData({
        nodes: nextProps.networkData.visNetworkData[0],
        edges: nextProps.networkData.visNetworkData[1]
      });
    }
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
            <SelectedEntity />
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
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
