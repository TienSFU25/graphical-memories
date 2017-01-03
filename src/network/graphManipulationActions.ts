import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { Node, Network } from 'vis';

import { ActionTypes, NodeAction, NetworkAction } from '../app/actionTypes';

export function addNode(nodeData: Node, callback: Function): NodeAction {
  callback(nodeData);

  return {
    type: ActionTypes.SELECT_NODE,
    nodeData
  }
}

export function saveNode(nodeId: number): Action {
  return {
    type: ActionTypes.SAVE_NODE
  }
}

export function selectNode(nodeId: number, network): NodeAction {
  network.storePositions();
  let nodeData = network.body.data.nodes.get(nodeId);

  return {
    type: ActionTypes.SELECT_NODE,
    nodeData
  };
}

function selectNetwork(): Action {
  return {
    type: ActionTypes.SELECT_NETWORK
  };
}

export function initializeNetworkSuccess(visNetwork: Network): NetworkAction {
  return {
    type: ActionTypes.INITIALIZE_NETWORK_SUCCESS,
    visNetwork
  }
}

export function selectEntity(clickEvent, network): Action {
  if (clickEvent.nodes && clickEvent.nodes.length > 0) {
    return selectNode(clickEvent.nodes[0], network);
  } else {
    return selectNetwork();
  }
}

export function editNode(nodeId: string, field: string, value: string) {
  let nodeData = {};
  nodeData["id"] = nodeId;
  nodeData[field] = value;

  return {
    type: ActionTypes.EDIT_NODE,
    nodeData
  };
}

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  addNode,
  saveNode,
  selectNode,
  selectNetwork,
  initializeNetworkSuccess,
  editNode,
  selectEntity
}

export default GraphManipulationCreatorsMap;
