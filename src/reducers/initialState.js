import * as vis from 'vis';

export default {
  selectedEntity: {
    type: 'Nothing',
    id: 0,
    data: {}
  },
  visNetwork: null,
  networkData: {
    isFresh: false,
    nodes: [],
    edges: []
  }
};
