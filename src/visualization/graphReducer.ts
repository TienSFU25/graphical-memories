import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { EntityType, SelectedEntity, TreeReducerState } from '../types';
import { attachIds } from './treeManipulator';

function _sortTree(root) {
  const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
  root.sort(sorter);
}

function _isDefined(e) {
  if (e === null || typeof(e) === "undefined") {
    return false;
  } else {
    return true;
  }
}

function findNode(node, id, parent = null) {
  if (node == null) return null;

  const children = node.children || node._children;
  // console.log(`checking ${node.id}`);
  if (node.id === id) {
    return { node, parent };
  } else if (children) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const result = findNode(child, id, node);

      if (_isDefined(result)) {
        return result
      }

      // return null;
    }
  } else {
    return null;
  }
};

function _reconstructTree(treeData, previousState, viewIndex: number, height: number, width: number) {
  attachIds(treeData);
  const newRoot = d3.hierarchy(treeData);
  const tree = d3.tree().size([height, width]);

  _sortTree(newRoot);
  tree(newRoot);

  // shift everything down
  newRoot.descendants().forEach((node) => {
    node['x'] += height * viewIndex;
  });

  return Object.assign({}, previousState, {
    raw: treeData,
    treeRoot: newRoot
  });
}

export default function graphReducer(state = emptyTree, action): TreeReducerState<string> {
  switch (action.type) {
    // case ActionTypes.ADD_NODE_SUCCESS: {
    //   return state;
    // }
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      const { graph, height, width, viewIndex } = action;

      return _reconstructTree(graph, state, viewIndex, height, width);
    }
    case ActionTypes.ADD_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { newNode, destNode, height, width, viewIndex } = action;

      const destNodeId = destNode.data.id;
      const destInData = findNode(dataCopy, destNodeId).node;

      const destChildren = destInData.children || destInData._children;
      if (destChildren) {
        destChildren.push(newNode);
      } else {
        destInData.children = [newNode];
      }

      return _reconstructTree(dataCopy, state, viewIndex, height, width);
    }
    case ActionTypes.EDIT_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { node, editData, viewIndex, height, width } = action;

      const nodeId = node.data.id;
      let nodeInData = findNode(dataCopy, nodeId).node;

      _.forEach(editData, (value, key) => {
        nodeInData[key] = value;
      });

      return _reconstructTree(dataCopy, state, viewIndex, height, width);
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

        return _reconstructTree(dataCopy, state, viewIndex, height, width);
      }
    }
    default: {
      return state;
    }
  }
}
