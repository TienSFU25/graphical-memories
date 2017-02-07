import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT, RADIAL_X, RADIAL_Y } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { d3Node, d3RootNode, EntityType, SelectedEntity, TreeReducerState, TreeType } from '../types';
import { attachIds, getNextId, findNode, project, translate } from './treeManipulator';

function _sortTree(root) {
  const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
  root.sort(sorter);
}

function _reconstructTree(treeData, changedNodeId, previousState: TreeReducerState<string>, toggleIds?: Set<number>, display = previousState.display) {
  // pull view size data from previous state
  const { maxHeight, maxWidth, dx, dy, dx2, dy2 } = previousState;

  const newRoot: d3RootNode = d3.hierarchy(treeData);
  let tree;

  if (display == TreeType.Radial) {
    // 360 500 worked
     tree = d3.tree().size([maxHeight / 3.33, maxWidth / 1.2]).separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
  } else {
     tree = d3.tree().size([maxHeight, maxWidth]);
  }

  _sortTree(newRoot);
  tree(newRoot);

  if (display == TreeType.Radial) {
    newRoot.each((node: d3Node) => {
      // stash original coordinates. this is used for links
      node.x0 = node.x;
      node.y0 = node.y;

      [node.x, node.y] = project(node.x, node.y);
    });
  } else {
    newRoot.each((node: d3Node) => {
      const oldY = node.y;
      node.y = node.x;
      node.x = oldY;
    });
  }

  const toggleCopy = toggleIds || new Set(previousState.toggleIds);
  let flat = [];

  newRoot.each((node: d3Node) => {
    // toggle children
    if (toggleCopy.has(node.data.id)) {
      node._children = node.children;
      node.children = null;
    }

    // need this to know absolute position
    node.dx = dx;
    node.dy = dy;

    // node.each is BFS
    flat.push(node);
  });

  // also find the node that needs rerendering
  let updateNode = null;

  if (changedNodeId) {
    newRoot.each((node: d3Node) => {
      if (changedNodeId === node.data.id) {
        updateNode = node;
      }
    });
  } else {
    updateNode = newRoot;
  }

  // for determining zoom
  newRoot.dx2 = dx2;
  newRoot.dy2 = dy2;

  return Object.assign({}, previousState, {
    raw: treeData,
    treeRoot: newRoot,
    toggleIds: toggleCopy,
    updateNode,
    display,
    flat
  });
}

export default function graphReducer(state = emptyTree, action): TreeReducerState<string> {
  const { graph } = action;
  const dataCopy = Object.assign({}, state.raw);

  switch (action.type) {
    case ActionTypes.SET_VIEWPORT_SIZE: {
      const { maxHeight, maxWidth, viewIndex } = action;

      let dx = 0;
      let dy = maxHeight * viewIndex;
      let dx2 = 0;
      let dy2 = 0;

      if (state.display === TreeType.Radial) {
        dx2 = RADIAL_X;
        dy2 = RADIAL_Y;
      }

      return Object.assign({}, state, {
        maxHeight,
        maxWidth,
        dx,
        dy,
        dx2,
        dy2
      });
    }
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      attachIds(graph);

      return _reconstructTree(graph, null, state);
    }
    case ActionTypes.ADD_NODE: {
      const { newNode, destNode } = action;

      const destNodeId = destNode.data.id;
      const destInData = findNode(dataCopy, destNodeId).node;
      newNode.id = getNextId();

      const destChildren = destInData.children || destInData._children;
      if (destChildren) {
        destChildren.push(newNode);
      } else {
        destInData.children = [newNode];
      }

      return _reconstructTree(dataCopy, destNodeId, state);
    }
    case ActionTypes.TOGGLE_NODE: {
      const { node, destNode } = action;

      const toggleCopy = new Set(state.toggleIds);

      if (toggleCopy.has(node.data.id)) {
        toggleCopy.delete(node.data.id);
      } else {
        toggleCopy.add(node.data.id);
      }

      return _reconstructTree(dataCopy, node.data.id, state, toggleCopy);
    }
    case ActionTypes.EDIT_NODE: {
      const { node, editData } = action;

      const nodeId = node.data.id;
      let nodeInData = findNode(dataCopy, nodeId).node;

      _.forEach(editData, (value, key) => {
        nodeInData[key] = value;
      });

      return _reconstructTree(dataCopy, nodeId, state);
    }
    case ActionTypes.DELETE_NODE: {
      const { node } = action;

      const nodeId = node.data.id;
      const parent = findNode(dataCopy, nodeId).parent;

      // deleting root
      if ( parent === null ) {
        console.log(`deleted the whole damn tree!`);
        return emptyTree;
      } else {
        let childIndex;

        // delete child in parent
        _.forEach(parent.children, (child, index) => {
          if (child.id === nodeId) {
            childIndex = index;
          }
        });

        parent.children.splice(childIndex, 1);

        return _reconstructTree(dataCopy, parent.id, state);
      }
    }
    case ActionTypes.ATTACH_IMAGE: {
      const { node, imageHref } = action;

      const nodeId = node.data.id;
      const nodeInData = findNode(dataCopy, nodeId).node;

      nodeInData.image = imageHref;

      return _reconstructTree(dataCopy, nodeId, state);
    }
    case ActionTypes.TOGGLE_TREE_DISPLAY: {
      const toggleCopy = new Set(state.toggleIds);
      const toggleView = state.display === TreeType.Radial ? TreeType.VerticalTree : TreeType.Radial;

      return _reconstructTree(dataCopy, null, state, toggleCopy, toggleView);
    }
    default: {
      return state;
    }
  }
}
