function jsonToVisNetwork(graph) {
  let nodes = graph.nodes.map(node => {
    return {
      attributes: node.attributes,
      x: node.x,
      y: node.y,
      id: node.id,
      label: node.label,
      size: node.size,
      color: node.color
    };
  });

  let edges = graph.edges.map(edge => {
    return {
      attributes: edge.attributes,
      id: edge.id,
      from: edge.source,
      to: edge.target,
      length: edge.length
    };
  });

  let data = {
    nodes: nodes,
    edges: edges
  };

  return data;
}

export default jsonToVisNetwork;
