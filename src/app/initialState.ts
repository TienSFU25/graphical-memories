import { ReduxStore, EntityType, GraphType, EditMode, TreeType } from '../types';

export const initialState = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null,
    node: null,
    htmlCoords: {
      x: 0,
      y: 0
    }
  },
  main: {
    subStates: []
  },
  editBox: {
    show: false,
    htmlCoords: {
      x: 0,
      y: 0
    }
  },
  carouselImages: [],
  editMode: EditMode.Standard
};

export default initialState;

/* Custom initial states */
export const emptyTree = {
  type: GraphType.Tree,
  display: TreeType.Radial,
  raw: {
    name: 'empty tree'
  },
  treeRoot: null,
  toggleIds: new Set(),
  updateNode: null,
  maxHeight: 0,
  maxWidth: 0,
  dx: 0,
  dy: 0,
  dx2: 0,
  dy2: 0,
  flat: []
};
