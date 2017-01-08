import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType, SelectedEntity } from '../types';

export default function rawGraphReducer(state: SelectedEntity = initialState.selectedEntity, action) {
  switch (action.type) {
    // case ActionTypes.ADD_NODE_SUCCESS: {
    //   return state;
    // }
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      return action.graph;
    }
    default: {
      return state;
    }
  }
}
