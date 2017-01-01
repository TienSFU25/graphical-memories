import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';

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
