import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function rawNetworkDataReducer(state = initialState.networkData, action) {
  switch (action.type) {
    case types.LOAD_GRAPH_SUCCESS: {
      return action.networkData;
    }
    default: {
      return Object.assign({}, state, {isFresh: false});
    }
  }
}
