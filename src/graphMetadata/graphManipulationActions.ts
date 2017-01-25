import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { d3Node } from '../types';

export function addNode(newNode, destNode) {
  return {
    type: ActionTypes.ADD_NODE,
    newNode,
    destNode
  };
}

export function toggleNode(node) {
  return {
    type: ActionTypes.TOGGLE_NODE,
    node
  };
}

export function deleteNode(node) {
  return {
    type: ActionTypes.DELETE_NODE,
    node
  };
}

export function selectNode(node: d3Node) {
  return {
    type: ActionTypes.SELECT_NODE,
    node
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

export function editNode(node, editData) {
  return {
    type: ActionTypes.EDIT_NODE,
    node,
    editData
  }
}

export function attachImageToNode(imageHref, node) {
  return {
    type: ActionTypes.ATTACH_IMAGE,
    node,
    imageHref
  }
}

export function showEditBox(htmlCoords) {
  return {
    type: ActionTypes.SHOW_EDIT,
    htmlCoords
  };
}

export function hideEditBox() {
  return {
    type: ActionTypes.HIDE_EDIT
  };
}

export function showAddBox(addCoords) {
  return {
    type: ActionTypes.SHOW_ADD,
    addCoords
  };
}

export function hideAddBox() {
  return {
    type: ActionTypes.HIDE_ADD
  };
}


export function showPopup(htmlCoords) {
  return {
    type: ActionTypes.SHOW_POPUP,
    htmlCoords
  }
}

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  addNode,
  toggleNode,
  selectNode,
  moveNode,
  editNode,
  deleteNode,
  // selectEntity,
  selectGraph,
  attachImageToNode,
  showEditBox,
  hideEditBox,

  showAddBox,
  hideAddBox,

  showPopup
}

export default GraphManipulationCreatorsMap;
