import * as React from 'react';
import {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../node_modules/vis/dist/vis.css';
import '../css/app.scss';
import graphManipulationActions from '../actions/graphManipulationActions';
import * as vis from 'vis';
import SelectedEntity from './SelectedEntity';
import {Row, Col} from 'react-bootstrap';

interface NetworkProps {
  actions: Object
}

class Network extends React.Component<any, any> {
  networkContainer: any;
  network: any;

  constructor(props) {
    super(props);
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

    this.network = new vis.Network(this.networkContainer, [], options);

    this.network.on('click', (params) => {
      this.props.actions.selectEntity(params, this.network);
    });

    this.network.on('dragEnd', (params) => {
      // assume only the node got dragged for now
      let id = params.nodes[0];

      this.props.actions.selectNode(id, this.network);
    });

    this.props.actions.initializeNetworkSuccess(this.network);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.networkData.isFresh) {
      this.network.setData({
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

// Network.propTypes = {
//   actions: PropTypes.object.isRequired
// };

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
