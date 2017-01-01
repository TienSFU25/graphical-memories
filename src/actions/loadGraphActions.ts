import { ActionTypes } from './actionTypes';
import { Action } from 'redux';
import loadGraphFromFile from '../api/loadGraphFromFileApi';
import jsonToVisNetwork from '../dataMappers/jsonToVisNetwork';

interface LoadGraphAction extends Action {
  networkData: any;
}

function loadGraphSuccess(networkData): LoadGraphAction {
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

      dispatch(loadGraphSuccess({ visNetworkData }));
      dispatch(selectNothing());
    }).catch(err => {
      throw(err);
    });
  }
}
