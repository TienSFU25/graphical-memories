import { Action, ActionCreatorsMapObject } from 'redux';

import loadGraphFromFile from '../api/loadGraphFromFileApi';
import { ActionTypes } from '../app/actionTypes';
// import { mapToNetworkData } from '../dataMappers';

function loadGraphSuccess(graph) {
  return {
    type: ActionTypes.LOAD_GRAPH_SUCCESS,
    graph
  };
}

function selectNothing(): Action {
  return {
    type: ActionTypes.SELECT_NOTHING
  };
}

export function loadGraph() {
  return function(dispatch) {
    return loadGraphFromFile().then(graph => {
      dispatch(loadGraphSuccess(graph));
      dispatch(selectNothing());
    }).catch(err => {
      throw(err);
    });
  }
}
