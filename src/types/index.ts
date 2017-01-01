import { Network, DataSet, Edge, Node } from 'vis'

export enum EntityType {
  Nothing,
  Network,
  Node
}

export interface SelectedEntity {
  type: EntityType,
  id: number,
  data: any
}

export interface NetworkData {
  isFresh: boolean,
  nodes: DataSet<Node>,
  edges: DataSet<Edge>
}

export interface ReduxStore {
  selectedEntity: SelectedEntity,
  visNetwork?: Network,
  networkData: NetworkData
}
