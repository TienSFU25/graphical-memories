import { Action } from 'redux';
import { NetworkData } from '../types';
import { Network, Node } from 'vis';

export enum ActionTypes {
  LOAD_GRAPH_SUCCESS,
  INITIALIZE_NETWORK_SUCCESS,
  ADD_NODE_SUCCESS,
  SELECT_NOTHING,
  SELECT_NETWORK,
  SELECT_NODE,
  SAVE_NODE,
  EDIT_NODE
}

export interface LoadGraphAction extends Action {
  networkData: NetworkData;
}

export interface NodeAction extends Action {
  readonly nodeData: Node
}

export interface NetworkAction extends Action {
  readonly visNetwork: Network
}
