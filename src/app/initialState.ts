import { ReduxStore, EntityType } from '../types';

const state = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  }
};

export default state;
