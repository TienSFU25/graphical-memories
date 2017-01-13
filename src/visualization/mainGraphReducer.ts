import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType, SelectedEntity } from '../types';
import graphReducer from './graphReducer';

const ridToReducer = {
  tree: graphReducer
};

export default function mainGraphReducer(state = initialState.main, action) {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      let newState = [];
      let viewHeight = TREE_HEIGHT / action.graph.length;

      for (let i = 0; i < action.graph.length; i++) {
        const graph = action.graph[i];
        const subState = ridToReducer[graph.type](null, {
          type: ActionTypes.LOAD_GRAPH_SUCCESS,
          height: viewHeight,
          width: TREE_WIDTH,
          viewIndex: i,
          graph: graph.value
        });

        // to be able to trace a node to corresponding substate
        subState.root['rid'] = i;
        subState.type = graph.type;
        newState.push(subState);
      }

      console.log(newState);
      return newState;
    }
    case ActionTypes.ADD_NODE: {
    }
    case ActionTypes.DELETE_NODE: {

    }
    case ActionTypes.MOVE_NODE: {
    }
    default: {
      return state;
    }
  }
}
