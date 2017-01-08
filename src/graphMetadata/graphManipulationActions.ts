import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';

// export function addNode(nodeData: Node, callback: Function) {
//   callback(nodeData);

//   return {
//     type: ActionTypes.SELECT_NODE,
//     nodeData
//   }
// }

// export function saveNode(nodeId: number): Action {
//   return {
//     type: ActionTypes.SAVE_NODE
//   }
// }

export function selectNode(nodeData) {
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

// export function selectEntity(clickEvent, network): Action {
//   if (clickEvent.nodes && clickEvent.nodes.length > 0) {
//     return selectNode(clickEvent.nodes[0], network);
//   } else {
//     return selectNetwork();
//   }
// }

// export function editNode(nodeId: string, field: string, value: string) {
//   let nodeData = {};
//   nodeData["id"] = nodeId;
//   nodeData[field] = value;

//   return {
//     type: ActionTypes.EDIT_NODE,
//     nodeData
//   };
// }

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  // addNode,
  // saveNode,
  // selectNode,
  // editNode,
  // selectEntity,
  selectNetwork
}

export default GraphManipulationCreatorsMap;
