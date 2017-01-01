import * as types from './actionTypes';
import loadGraphFromFile from '../api/loadGraphFromFileApi';
import jsonToVisNetwork from '../dataMappers/jsonToVisNetwork';

function loadGraphSuccess(networkData) {
  networkData.isFresh = true;

  return {
    type: types.LOAD_GRAPH_SUCCESS,
    networkData
  };
}

function selectNothing() {
  return {
    type: types.SELECT_NOTHING
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
