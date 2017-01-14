import { ReduxStore, EntityType, GraphType } from '../types';

export const initialState = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  },
  main: {
    subStates: []
  }
};

export default initialState;

/* Custom initial states */

export const emptyTree = {
  type: GraphType.Tree,
  raw: {},
  treeRoot: {},
  editMode: 'None'
};
