import * as types from '../actions/actionTypes';
import initialState from './initialState';
import jsonToVisNetwork from '../dataMappers/jsonToVisNetwork';
import * as vis from 'vis';

export default function graphReducer(state = initialState.graph, action) {
  switch (action.type) {
    case types.LOAD_GRAPH_SUCCESS:
      let visNetworkData = jsonToVisNetwork(action.graph);

      return {
        nodes: new vis.DataSet(visNetworkData.nodes),
        edges: new vis.DataSet(visNetworkData.edges)
      };

    case types.ADD_NODE_SUCCESS:
      let nodeData = action.nodeData;
      state.nodes.add(nodeData);

      return state;

    default:
      return state;
  }
}
