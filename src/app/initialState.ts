import { ReduxStore, EntityType } from '../types';

const state = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  },
  graph: {
    raw: {},
    treeRoot: {},
    editMode: 'None'
  }
};

export default state;
