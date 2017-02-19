import { ReduxStore, EntityType, GraphType, EditMode, TreeType } from '../types';

export const initialState = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    node: null,
    htmlCoords: {
      x: 0,
      y: 0
    }
  },
  main: {
    graphState: {},
    graphType: GraphType.Tree
  },
  editBox: {
    show: false,
    editMode: EditMode.Standard
  },
  carouselImages: [],
  zoomEnabled: false,
  toolTip: {
    show: false,
    htmlCoords: {
      x: 0,
      y: 0
    },
    // readonly data
    node: null
  }
};

export default initialState;

/* Custom initial states */
export const emptyTree = {
  name: 'default empty tree',
  color: '',
  type: GraphType.Tree,
  display: TreeType.Radial,
  raw: {
    name: 'empty tree'
  },
  treeRoot: null,
  toggleIds: new Set(),
  updateNode: null,
  flat: []
};
