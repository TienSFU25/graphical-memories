import * as d3 from 'd3';

import { d3Node } from '../types';

export class TreeHelper {
  static getRid(node: d3Node): number {
    const ancestors = node.ancestors();
    return ancestors[ancestors.length - 1]['rid'];
  }

  // returns a binary tree for testing
  static generateTree = (numberOfNodes, rid) => {
    const root = {
      id: 0,
      name: String.fromCharCode(97),
      children: []
    };

    root['rid'] = rid;

    let queue = [root];
    let index = 1;

    while (index < numberOfNodes) {
      const currentNode = queue.splice(0, 1);
      const child1 = {
        id: index,
        name: String.fromCharCode(97 + index),
        children: []
      };

      index += 1;

      const child2 = {
        id: index,
        name: String.fromCharCode(97 + index),
        children: []
      };

      index += 1;

      currentNode[0].children = [child1, child2];
      queue.push(child1);
      queue.push(child2);
    }

    const d3Root = d3.hierarchy(root);

    let leaf = d3Root;
    let internal = d3Root.children[0];

    while (leaf.children && leaf.children.length) {
      leaf = leaf.children[0];
    }

    return [root, d3Root, internal, leaf];
  }
}
