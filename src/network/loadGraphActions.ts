import { Action, ActionCreatorsMapObject } from 'redux';

import { NetworkData } from '../types';
import loadGraphFromFile from '../api/loadGraphFromFileApi';
import { ActionTypes, LoadGraphAction } from '../app/actionTypes';
import { mapToNetworkData } from '../dataMappers';

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

const LoadGraphActionCreatorsMap: ActionCreatorsMapObject = {
  loadGraphFromString
}

function loadGraphFromString(userGraph: string): Action {
  const visNetworkData = mapToNetworkData(userGraph);

  return loadGraphSuccess(visNetworkData);
}

export default LoadGraphActionCreatorsMap

export function loadGraph() {
  return function(dispatch) {
    return loadGraphFromFile().then(graph => {
      const visNetworkData = mapToNetworkData(graph);

      dispatch(loadGraphSuccess(visNetworkData));
      dispatch(selectNothing());
    }).catch(err => {
      throw(err);
    });
  }
}
