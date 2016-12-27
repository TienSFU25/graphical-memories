function jsonToVisNetwork(graph) {
  let nodes = graph.nodes.map(node => {
    return {
      attributes: node.attributes,
      id: node.id,
      label: node.label
    };
  });

  let edges = graph.edges.map(edge => {
    return {
      id: edge.id,
      from: edge.source,
      to: edge.target
    };
  });

  let data = {
    nodes: nodes,
    edges: edges
  };

  return data;
}

export default jsonToVisNetwork;
