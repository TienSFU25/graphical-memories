import { ActionTypes, LoadGraphAction } from '../actions/actionTypes';
import initialState from './initialState';
import { Action } from 'redux';
import { NetworkData } from '../types';

export default function rawNetworkDataReducer(state: NetworkData = initialState.networkData, action: LoadGraphAction) {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      return action.networkData;
    }
    default: {
      return Object.assign({}, state, {isFresh: false});
    }
  }
}
