import { ReduxStore, EntityType, GraphType } from '../types';

export const initialState = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  },
  main: {
    subStates: []
  },
  editBox: {
    show: true,
    htmlCoords: {
      x: 0,
      y: 0
    }
  }
};

export default initialState;

/* Custom initial states */
export const emptyTree = {
  type: GraphType.Tree,
  raw: {
    name: 'empty tree'
  },
  treeRoot: null,
  editMode: 'None'
};
