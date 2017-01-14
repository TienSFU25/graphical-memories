import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree, initialState } from '../app/initialState';

import { GraphAction, GraphsData, GraphType, TypedGraph, TreeReducerState, AllGraphsReducerState } from '../types';
import graphReducer from './graphReducer';
import { TreeHelper } from './treeHelper';

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

const forwardActionToReducer = function(graph: TypedGraph<any>, actionType, previousState, viewHeight, viewIndex, params?): TreeReducerState<string> {
  let reducer;

  switch (graph.type) {
    case GraphType.Tree: {

    }
    default: {
      reducer = graphReducer;
    }
  }

  const subState = reducer(previousState, {
    type: actionType,
    height: viewHeight,
    width: TREE_WIDTH,
    viewIndex,
    graph: graph.value,
    ...params
  });

  return subState;
}

// const _getRid = (node) => {
//   const ancestors = node.ancestors();
//   return ancestors[ancestors.length - 1].rid;
// }

export default function mainGraphReducer(state = initialState.main, action: GraphAction): AllGraphsReducerState {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      let subStates = [];
      let viewHeight = TREE_HEIGHT / action.graph.length;

      for (let i = 0; i < action.graph.length; i++) {
        const graph = action.graph[i];
        let subState = forwardActionToReducer(graph, ActionTypes.LOAD_GRAPH_SUCCESS, null, viewHeight, i);

        // to be able to trace a node to corresponding substate
        subState.treeRoot.rid = i;
        subState.type = graph.type;
        subStates.push(subState);
      }

      // console.log(newState);
      return Object.assign({}, state, { subStates });
    }
    case ActionTypes.ADD_NODE: {
      // const srcGraph =
    }
    case ActionTypes.DELETE_NODE: {

    }
    // src, dest
    case ActionTypes.MOVE_NODE: {
      const { src, dest } = action;
      let [srcRid, destRid] =  [src, dest].map(TreeHelper.getRid);

      let viewHeight = TREE_HEIGHT / state.subStates.length;
      let [srcGraph, destGraph] = [state.subStates[srcRid], state.subStates[destRid]];

      const srcCopy = Object.assign({}, src.data);

      // add in dest
      let subDestState = forwardActionToReducer(destGraph, ActionTypes.ADD_NODE, destGraph, viewHeight, destRid, { newNode: srcCopy, destNode: dest });

      subDestState.treeRoot.rid = destRid;
      subDestState.type = destGraph.type;

      // no need to copy again, subreducers already make a new copy
      state.subStates[destRid] = subDestState;

      // delete in src
      let subSrcState = forwardActionToReducer(srcGraph, ActionTypes.DELETE_NODE, srcGraph, viewHeight, srcRid, { node: src });

      // deleted the root
      if (subSrcState == emptyTree) {
        state.subStates.splice(srcRid, 1);
      } else {
        subSrcState.treeRoot.rid = srcRid;
        subSrcState.type = srcGraph.type;
        state.subStates[srcRid] = subSrcState;
      }

      return Object.assign({}, state);
    }
    default: {
      return state;
    }
  }
}
