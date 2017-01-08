import { Action, ActionCreatorsMapObject } from 'redux';

import loadGraphFromFile from '../api/loadGraphFromFileApi';
import { ActionTypes } from '../app/actionTypes';
import { mapToNetworkData } from '../dataMappers';

function loadGraphSuccess(networkData) {
  networkData.isFresh = true;

  return {
    type: ActionTypes.LOAD_GRAPH_SUCCESS,
    networkData
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
