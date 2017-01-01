import { ReduxStore, EntityType } from '../types';
import { DataSet, Node, Edge } from 'vis';

const state = {
  selectedEntity: {
    type: EntityType.Nothing,
    id: 0,
    data: null
  },
  visNetwork: null,
  networkData: {
    isFresh: false,
    nodes: new DataSet<Node>([]),
    edges: new DataSet<Edge>([])
  }
};

export default state;
