import { Action } from 'redux';

import { NetworkData } from '../types';
import loadGraphFromFile from '../api/loadGraphFromFileApi';
import { ActionTypes, LoadGraphAction } from '../app/actionTypes';
import jsonToVisNetwork from '../dataMappers/jsonToVisNetwork';

function loadGraphSuccess(networkData: NetworkData): LoadGraphAction {
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

export default function loadGraph() {
  return function(dispatch) {
    return loadGraphFromFile().then(graph => {
      let visNetworkData = jsonToVisNetwork(graph);

      dispatch(loadGraphSuccess(visNetworkData));
      dispatch(selectNothing());
    }).catch(err => {
      throw(err);
    });
  }
}
