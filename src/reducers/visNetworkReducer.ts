import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function graphReducer(state = initialState.visNetwork, action) {
  switch (action.type) {
    case types.INITIALIZE_NETWORK_SUCCESS: {
      return action.visNetwork;
    }
    default: {
      return state;
    }
  }
}
