import * as types from './actionTypes';
import loadGraphFromFile from '../api/loadGraphFromFileApi';

export function loadGraphSuccess(graph) {
  return {
    type: types.LOAD_GRAPH_SUCCESS,
    graph
  };
}

export function loadGraph(fileName) {
  return function(dispatch) {
    return loadGraphFromFile(fileName).then(graph => {
      dispatch(loadGraphSuccess(graph));
    }).catch(err => {
      throw(err);
    });
  }
}
