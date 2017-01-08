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

export interface ReduxStore {
  selectedEntity: SelectedEntity
}
