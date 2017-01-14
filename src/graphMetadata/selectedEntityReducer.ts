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
    case ActionTypes.SELECT_GRAPH: {
      return Object.assign({}, state,
        {
          type: EntityType.Graph,
          id: 1
        });
    }
    case ActionTypes.SELECT_NODE: {
      return Object.assign({}, state,
        {
          type: EntityType.Node,
          id: 2,
          node: action.node
        });
    }
    default: {
      return state;
    }
  }
}
