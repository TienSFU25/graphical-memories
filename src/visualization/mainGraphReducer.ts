import { ActionTypes } from '../app/actionTypes';
import { emptyTree, initialState } from '../app/initialState';

import { GraphAction, GraphType, TreeReducerState } from '../types';
import graphReducer from './graphReducer';

// corresponds to the order in GraphTypes
// make this better if necessary
const ridToReducer = function(graphType) {
  switch (graphType) {
    case GraphType.Tree: {

    }
    default: {
      return graphReducer;
    }
  }
}

const forwardActionToReducer = function(state, graphType, actionType, params?): TreeReducerState<string> {
  let reducer = ridToReducer(graphType);

  const subState = reducer(state, {
    type: actionType,
    ...params
  });

  return subState;
}

export default function mainGraphReducer(state = initialState.main, action: GraphAction) {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      const graph = action.graph[0];

      let reducer = ridToReducer(graph.type);

      const nextState = reducer(graph, {
        type: ActionTypes.LOAD_GRAPH_SUCCESS,
        graph: graph.value
      });

      return Object.assign({}, { graphState: nextState, type: graph.type });
    }

    default: {
      const { graphState, graphType } = state;
      const { type, ...params } = action;

      let nextSubState = forwardActionToReducer(graphState, graphType, type, params);

      return Object.assign({}, state, { graphState: nextSubState });
    }
  }
}
