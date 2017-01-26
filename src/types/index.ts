import { Action } from 'redux';
import * as d3 from 'd3';

// export type d3Node = d3.HierarchyNode<GraphNode<any>>;

export interface d3Node extends d3.HierarchyNode<GraphNode<any>> {
  _children?: Array<d3.HierarchyNode<GraphNode<any>>>;
  x?: number;
  y?: number;
}

export enum EntityType {
  Nothing,
  Graph,
  Node
}

export interface SelectedEntity {
  type: EntityType,
  id: number,
  data: any,
  node: d3Node
}

export interface ReduxStore {
  selectedEntity: SelectedEntity
}

/* Reducer states */
export interface TreeReducerState<T> {
  type: GraphType,
  value?: TreeNode<T>,
  raw: TreeNode<T>,
  treeRoot: d3.HierarchyNode<TreeNode<any>> & {rid: number},
  updateNode: TreeNode<T>,
  toggleIds: Set<number>
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
  name: T,
  image?: string
}

export interface TreeNode<T> extends GraphNode<T> {
  children?: Array<TreeNode<T>>
}

// export interface TypedGraph<T> {
//   type: GraphType,
//   value: GraphNode<T>
// }

export interface GraphsData extends Array<TreeReducerState<any>> {}

/* Action types */
export interface GraphAction extends Action {
  graph?: GraphsData,
  src?: d3Node,
  dest?: d3Node,
  newNode?: any,
  destNode?: d3Node,
  node?: d3Node,
  editData?: any,
  imageHref?: string
}
