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
