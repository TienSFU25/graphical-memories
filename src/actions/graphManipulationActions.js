import * as types from './actionTypes';

export function addNode(nodeData, callback) {
  callback(nodeData);

  return {
    type: types.ADD_NODE_SUCCESS
  };
}

export function editNode(nodeData) {
  return {
    type: types.EDIT_NODE,
    nodeData
  };
}

export function selectNode(nodeId, network) {
  network.storePositions();
  let nodeData = network.body.data.nodes.get(nodeId);

  return {
    type: types.SELECT_NODE,
    nodeData
  };
}

function selectNetwork() {
  return {
    type: types.SELECT_NETWORK
  };
}

export function initializeNetworkSuccess(visNetwork) {
  return {
    type: types.INITIALIZE_NETWORK_SUCCESS,
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
