import { DataSet, Edge, Node } from 'vis';
import { NetworkData } from '../types';
import * as _ from 'lodash';

function datasetToNetwork(graph): NetworkData {
  let nodes = _.mapValues(graph.nodes._data, (node => {
    return {
      attributes: node.attributes,
      x: node.x,
      y: node.y,
      id: node.id,
      label: node.label,
      size: node.size,
      color: node.color
    };
  }));

  let edges = _.mapValues(graph.edges._data, (edge => {
    return {
      attributes: edge.attributes,
      id: edge.id,
      from: edge.from,
      to: edge.to,
      length: edge.length
    };
  }));

  let nodeDataSet = new DataSet<Node>(_.toArray(nodes));
  let edgeDataSet = new DataSet<Edge>(_.toArray(edges));

  return {
    isFresh: true,
    nodes: nodeDataSet,
    edges: edgeDataSet
  };
}

export default datasetToNetwork;
