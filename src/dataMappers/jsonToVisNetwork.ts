import { DataSet, Edge, Node } from 'vis';
import { NetworkData } from '../types';

function jsonToVisNetwork(graph): NetworkData {
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

  let nodeDataSet = new DataSet<Node>(nodes);
  let edgeDataSet = new DataSet<Edge>(edges);

  return {
    isFresh: true,
    nodes: nodeDataSet,
    edges: edgeDataSet
  };
}

export default jsonToVisNetwork;
