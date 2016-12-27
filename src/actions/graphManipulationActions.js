import * as types from './actionTypes';

export function addNode(nodeData, callback) {
  return {
    type: types.ADD_NODE_SUCCESS,
    nodeData
  };
}
