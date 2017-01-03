import { Network } from 'vis';

import { ActionTypes, NetworkAction } from '../app/actionTypes';
import initialState from '../app/initialState';

export default function graphReducer(state : Network = initialState.visNetwork, action : NetworkAction) {
  switch (action.type) {
    case ActionTypes.INITIALIZE_NETWORK_SUCCESS: {
      return action.visNetwork;
    }
    default: {
      return state;
    }
  }
}
