import {ActionTypes} from '../actions/actionTypes';
import initialState from './initialState';

export default function rawNetworkDataReducer(state = initialState.networkData, action) {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      return action.networkData;
    }
    default: {
      return Object.assign({}, state, {isFresh: false});
    }
  }
}
