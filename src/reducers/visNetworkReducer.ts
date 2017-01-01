import { ActionTypes } from '../actions/actionTypes';
import initialState from './initialState';

export default function graphReducer(state = initialState.visNetwork, action) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_NETWORK_SUCCESS: {
      return action.visNetwork;
    }
    default: {
      return state;
    }
  }
}
