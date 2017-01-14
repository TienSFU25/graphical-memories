import { Action } from 'redux';
import * as d3 from 'd3';

export enum EntityType {
  Nothing,
  Graph,
  Node
}

export interface SelectedEntity {
  type: EntityType,
  id: number,
  data: any
}

export interface ReduxStore {
  selectedEntity: SelectedEntity
}

/* Reducer states */
export interface TreeReducerState<T> {
  type: GraphType,
  raw: TreeNode<T>,
  treeRoot: d3.HierarchyNode<TreeNode<any>> & {rid: number},
  editMode?: string
}

export interface AllGraphsReducerState {
  subStates: Array<TreeReducerState<any>>
}

/* Graph related */
export enum GraphType {
  Tree
}

export interface GraphNode<T> {
  id?: number,
  name: T
}

export interface TreeNode<T> extends GraphNode<T> {
  children?: Array<TreeNode<T>>
}

export interface TypedGraph<T> {
  type: GraphType,
  value: GraphNode<T>
}

export interface GraphsData extends Array<TypedGraph<any>> {}

/* Action types */
export interface GraphAction extends Action {
  graph?: GraphsData,
  src?: d3.HierarchyNode<GraphNode<any>>,
  dest?: d3.HierarchyNode<GraphNode<any>>
}
