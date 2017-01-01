import { Action } from 'redux';
import { Node } from 'vis';

export enum ActionTypes {
  LOAD_GRAPH_SUCCESS,
  INITIALIZE_NETWORK_SUCCESS,
  ADD_NODE_SUCCESS,
  SELECT_NOTHING,
  SELECT_NETWORK,
  SELECT_NODE,
  EDIT_NODE
}

export interface LoadGraphAction extends Action {
  networkData: any;
}

export interface NodeAction extends Action {
  readonly nodeData: Node
}
