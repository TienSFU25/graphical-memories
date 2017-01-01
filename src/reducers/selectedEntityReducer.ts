import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function selectedEntityReducer(state = initialState.selectedEntity, action) {
  switch (action.type) {
    case types.SELECT_NOTHING: {
      return Object.assign({}, state,
        {
          type: 'Nothing',
          id: 0
        });
    }
    case types.ADD_NODE_SUCCESS: {
      return state;
    }
    case types.EDIT_NODE: {
      return state;
      // return Object.assign({}, state,
      //   {
      //     type: 'Node',
      //     id: 2,
      //     data: state.visNetwork.body.data.nodes.get(action.nodeData.id)
      //   });
    }
    case types.SELECT_NETWORK: {
      return Object.assign({}, state,
        {
          type: 'Network',
          id: 1
        });
    }
    case types.SELECT_NODE: {
      return Object.assign({}, state,
        {
          type: 'Node',
          id: 2,
          data: action.nodeData
        });
    }
    default: {
      return state;
    }
  }
}
