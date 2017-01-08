import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType, SelectedEntity } from '../types';

export default function selectedEntityReducer(state: SelectedEntity = initialState.selectedEntity, action) {
  switch (action.type) {
    case ActionTypes.SELECT_NOTHING: {
      return Object.assign({}, state,
        {
          type: EntityType.Nothing,
          id: 0
        });
    }
    case ActionTypes.ADD_NODE_SUCCESS: {
      return state;
    }
    case ActionTypes.SELECT_NETWORK: {
      return Object.assign({}, state,
        {
          type: EntityType.Network,
          id: 1
        });
    }
    case ActionTypes.SELECT_NODE: {
      return Object.assign({}, state,
        {
          type: EntityType.Node,
          id: 2,
          data: action.nodeData
        });
    }
    case ActionTypes.EDIT_NODE: {
      // oh well
      const newNodeData = Object.assign({}, state.data, action.nodeData);

      return Object.assign({}, state,
        {
          type: EntityType.Node,
          id: 2,
          data: newNodeData
        });
    }
    default: {
      return state;
    }
  }
}
