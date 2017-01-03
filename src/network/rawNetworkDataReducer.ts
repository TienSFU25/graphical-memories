import { Action } from 'redux';

import { ActionTypes, LoadGraphAction } from '../app/actionTypes';
import initialState from '../app/initialState';
import { NetworkData } from '../types';

export default function rawNetworkDataReducer(state: NetworkData = initialState.networkData, action) {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      return action.networkData;
    }
    case ActionTypes.EDIT_NODE: {
      state.nodes.update(action.nodeData);

      return state;
    }
    default: {
      return Object.assign({}, state, {isFresh: false});
    }
  }
}
