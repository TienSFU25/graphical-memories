import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT, RADIAL_X, RADIAL_Y } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { d3Node, d3RootNode, EntityType, SelectedEntity, TreeReducerState, TreeType } from '../types';
import { attachIds, getNextId, findNode, project, translate } from './treeManipulator';

export function nodeSrcTransform(source: d3Node) {
  return `translate(${source.x}, ${source.y})`;
}

export function linkSrcTransform(d: d3Node) {
  return `M${d.parent.x},${d.parent.y}`
    + `C${d.parent.x},${d.parent.y}`
    + ` ${d.parent.x},${d.parent.y}`
    + ` ${d.parent.x},${d.parent.y}`;
}

export default {
  0: {
    getTree(height, width) {
      return d3.tree().size([height, width]);
    },
    processNode(node: d3Node) {
      // stash original coordinates. this is used for links
      const oldY = node.y;
      node.y = node.x;
      node.x = oldY
    },
    setD2(newRoot: d3RootNode) {
      newRoot.dx2 = 0;
      newRoot.dy2 = 0;
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkDestTransform(d: d3Node) {
      return `M${d.x},${d.y}`
        + `C${d.parent.x + 100},${d.y}`
        + ` ${d.parent.x + 100},${d.parent.y}`
        + ` ${d.parent.x},${d.parent.y}`;
    }
  },
  1: {
    getTree(height, width) {
      return d3.tree().size([height / 3.33, width / 1.2]).separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
    },
    processNode(node: d3Node) {
      // stash original coordinates. this is used for links
      node.x0 = node.x;
      node.y0 = node.y;

      [node.x, node.y] = project(node.x, node.y);
    },
    setD2(newRoot: d3RootNode) {
      newRoot.dx2 = RADIAL_X,
      newRoot.dy2 = RADIAL_Y
    },
    nodeDestTransform(d: d3Node) {
      return `translate(${d.x}, ${d.y})`;
    },
    linkDestTransform(d: d3Node) {
      return "M" + (project(d.x0, d.y0))
          + "C" + (project(d.x0, (d.y0 + d.parent.y0) / 2))
          + " " + (project(d.parent.x0, (d.y0 + d.parent.y0) / 2))
          + " " + (project(d.parent.x0, d.parent.y0));
    }
  }
}
