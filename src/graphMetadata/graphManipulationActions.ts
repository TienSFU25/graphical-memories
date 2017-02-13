import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { d3Node } from '../types';
import { toHtmlCoords } from '../shared/svgHelper';

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
  const htmlCoords = toHtmlCoords(node);

  return {
    type: ActionTypes.SELECT_NODE,
    htmlCoords,
    node
  };
}

export function selectGraph(graphName, graphRid) {
  return {
    type: ActionTypes.SELECT_GRAPH,
    graphName,
    graphRid
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

export function toggleGraphType(graphRid) {
  return {
    type: ActionTypes.TOGGLE_TREE_DISPLAY,
    graphRid
  }
}

const GraphManipulationCreatorsMap: ActionCreatorsMapObject = {
  addNode,
  toggleNode,
  selectNode,
  moveNode,
  editNode,
  deleteNode,
  selectGraph,
  attachImageToNode,
  toggleGraphType
}

export default GraphManipulationCreatorsMap;
