import { ActionTypes } from './actionTypes';
import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { Node, Network } from 'vis';

interface NodeAction extends Action {
  readonly nodeData: Node
}

export function addNode(nodeData: Node, callback: Function): NodeAction {
  callback(nodeData);

  return {
    type: ActionTypes.SELECT_NODE,
    nodeData
  }
}

export function editNode(nodeData: Node): NodeAction {
  return {
    type: ActionTypes.EDIT_NODE,
    nodeData
  };
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

export function initializeNetworkSuccess(visNetwork: Network) {
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

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  addNode,
  editNode,
  selectNode,
  selectNetwork,
  initializeNetworkSuccess,
  selectEntity
}

export default GraphManipulationCreatorsMap;
