let state = {
  selectedEntity: {
    type: 'Nothing',
    id: 0,
    data: null
  },
  visNetwork: null,
  networkData: {
    isFresh: false,
    nodes: [],
    edges: []
  }
};

export default state;