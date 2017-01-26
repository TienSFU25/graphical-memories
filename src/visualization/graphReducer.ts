import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { d3Node, EntityType, SelectedEntity, TreeReducerState } from '../types';
import { attachIds, getNextId, findNode } from './treeManipulator';

function _sortTree(root) {
  const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
  root.sort(sorter);
}

function _reconstructTree(treeData, changedNodeId, previousState, viewIndex: number, height: number, width: number, toggleIds?: Set<number>) {
  const newRoot: d3Node = d3.hierarchy(treeData);
  const tree = d3.tree().size([height, width]);

  _sortTree(newRoot);
  tree(newRoot);

  // shift everything down
  newRoot.descendants().forEach((node) => {
    node['x'] += height * viewIndex;
  });

  // toggle children
  const toggleCopy = toggleIds || new Set(previousState.toggleIds);
  newRoot.each((node: d3Node) => {
    if (toggleCopy.has(node.data.id)) {
      node._children = node.children;
      node.children = null;
    }
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

  return Object.assign({}, previousState, {
    raw: treeData,
    treeRoot: newRoot,
    toggleIds: toggleCopy,
    updateNode
  });
}

function replaceChild(parent, node) {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];

    if (child.data.id === node.data.id) {
      parent.children[i] = node;
      return;
    }
  }
}

export default function graphReducer(state = emptyTree, action): TreeReducerState<string> {
  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      const { graph, height, width, viewIndex } = action;
      attachIds(graph);

      return _reconstructTree(graph, null, state, viewIndex, height, width);
    }
    case ActionTypes.ADD_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { newNode, destNode, height, width, viewIndex } = action;

      const destNodeId = destNode.data.id;
      const destInData = findNode(dataCopy, destNodeId).node;
      newNode.id = getNextId();

      const destChildren = destInData.children || destInData._children;
      if (destChildren) {
        destChildren.push(newNode);
      } else {
        destInData.children = [newNode];
      }

      return _reconstructTree(dataCopy, destNodeId, state, viewIndex, height, width);
    }
    case ActionTypes.TOGGLE_NODE: {
      const { node, destNode, height, width, viewIndex } = action;

      const dataCopy = Object.assign({}, state.raw);
      const toggleCopy = new Set(state.toggleIds);

      if (toggleCopy.has(node.data.id)) {
        toggleCopy.delete(node.data.id);
      } else {
        toggleCopy.add(node.data.id);
      }

      return _reconstructTree(dataCopy, node.data.id, state, viewIndex, height, width, toggleCopy);
    }
    case ActionTypes.EDIT_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { node, editData, viewIndex, height, width } = action;

      const nodeId = node.data.id;
      let nodeInData = findNode(dataCopy, nodeId).node;

      _.forEach(editData, (value, key) => {
        nodeInData[key] = value;
      });

      return _reconstructTree(dataCopy, nodeId, state, viewIndex, height, width);
    }
    case ActionTypes.DELETE_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { node, height, width, viewIndex } = action;

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

        return _reconstructTree(dataCopy, parent.id, state, viewIndex, height, width);
      }
    }
    case ActionTypes.ATTACH_IMAGE: {
      const dataCopy = Object.assign({}, state.raw);
      const { node, imageHref, height, width, viewIndex } = action;

      const nodeId = node.data.id;
      const nodeInData = findNode(dataCopy, nodeId).node;

      nodeInData.image = imageHref;

      return _reconstructTree(dataCopy, nodeId, state, viewIndex, height, width);
    }
    default: {
      return state;
    }
  }
}
