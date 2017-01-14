import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';

export function addNode(newNode, destNode) {
  return {
    type: ActionTypes.ADD_NODE,
    newNode,
    destNode
  }
}

export function deleteNode(node) {
  return {
    type: ActionTypes.DELETE_NODE,
    node
  }
}

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

export function selectGraph(): Action {
  return {
    type: ActionTypes.SELECT_GRAPH
  };
}

export function moveNode(src, dest) {
  return {
    type: ActionTypes.MOVE_NODE,
    src,
    dest
  };
}

// export function selectEntity(clickEvent, network): Action {
//   if (clickEvent.nodes && clickEvent.nodes.length > 0) {
//     return selectNode(clickEvent.nodes[0], network);
//   } else {
//     return selectNetwork();
//   }
// }

export function editNode(node, editData) {
  return {
    type: ActionTypes.EDIT_NODE,
    node,
    editData
  };
}

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  // addNode,
  // saveNode,
  selectNode,
  moveNode,
  editNode,
  // selectEntity,
  selectGraph
}

export default GraphManipulationCreatorsMap;
