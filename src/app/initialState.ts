import { ReduxStore, EntityType, GraphType, EditMode, TreeType } from '../types';

export const initialState = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    graph: null,
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
  zoomEnabled: false
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
  maxHeight: 0,
  maxWidth: 0,
  dx: 0,
  dy: 0,
  flat: []
};
