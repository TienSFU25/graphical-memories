import { ReduxStore, EntityType } from '../types';

const state = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  },
  main: {
    subStates: []
  },
  graph: {
    raw: {},
    treeRoot: {},
    editMode: 'None'
  }
};

export default state;
