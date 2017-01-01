import {ActionTypes} from './actionTypes';
import {ActionCreatorsMapObject} from 'redux';

export function addNode(nodeData, callback) {
  callback(nodeData);

  return {
    type: ActionTypes.ADD_NODE_SUCCESS
  };
}

export function editNode(nodeData) {
  return {
    type: ActionTypes.EDIT_NODE,
    nodeData
  };
}

export function selectNode(nodeId, network) {
  network.storePositions();
  let nodeData = network.body.data.nodes.get(nodeId);

  return {
    type: ActionTypes.SELECT_NODE,
    nodeData
  };
}

function selectNetwork() {
  return {
    type: ActionTypes.SELECT_NETWORK
  };
}

export function initializeNetworkSuccess(visNetwork) {
  return {
    type: ActionTypes.INITIALIZE_NETWORK_SUCCESS,
    visNetwork
  }
}

export function selectEntity(clickEvent, network) {
  if (clickEvent.nodes && clickEvent.nodes.length > 0) {
    return selectNode(clickEvent.nodes[0], network);
  } else {
    return selectNetwork();
  }
}

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  addNode,
  editNode,
  selectNode,
  selectNetwork,
  initializeNetworkSuccess,
  selectEntity
}

export default GraphManipulationCreatorsMap;
