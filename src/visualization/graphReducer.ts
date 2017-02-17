import * as d3 from 'd3';
import * as _ from 'lodash';

import { ActionTypes } from '../app/actionTypes';
import { emptyTree } from '../app/initialState';
import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { d3Node, d3RootNode, EntityType, SelectedEntity, TreeReducerState, TreeType } from '../types';
import { attachIds, getNextId, findNode, project, translate } from './treeManipulator';
import graphProcessor from './graphProcessor';

function _sortTree(root) {
  const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
  root.sort(sorter);
}

function _reconstructTree(treeData, changedNodeId, previousState: TreeReducerState<string>, toggleIds?: Set<number>, display = previousState.display) {
  // pull view size data from previous state
  const { name, color } = previousState;
  const processor = graphProcessor[display];

  const newRoot: d3RootNode = d3.hierarchy(treeData);

  const tree = processor.getTree(TREE_HEIGHT, TREE_WIDTH);

  _sortTree(newRoot);
  tree(newRoot);

  const toggleCopy = toggleIds || new Set(previousState.toggleIds);
  let flat = [];

  newRoot.each((node: d3Node) => {
    // toggle children
    if (toggleCopy.has(node.data.id)) {
      node._children = node.children;
      node.children = null;
    }

    // node.each is BFS
    flat.push(node);
  });

  processor.processRoot(newRoot);

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
  processor.setDs(newRoot);

  return Object.assign({}, previousState, {
    name,
    color,
    raw: treeData,
    treeRoot: newRoot,
    toggleIds: toggleCopy,
    updateNode,
    display,
    flat
  });
}

function _addNode(newNode, destNode, dataCopy, state) {
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

function _deleteNode(node, dataCopy, state) {
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

export default function graphReducer(state = emptyTree, action): TreeReducerState<string> {
  const dataCopy = Object.assign({}, state.raw);

  switch (action.type) {
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      const { graph } = action;
      attachIds(graph);

      return _reconstructTree(graph, null, state);
    }
    case ActionTypes.ADD_NODE: {
      const { newNode, destNode } = action;
      return _addNode(newNode, destNode, dataCopy, state);
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
      return _deleteNode(node, dataCopy, state);
    }
    case ActionTypes.MOVE_NODE: {
      const { src, dest } = action;
      const srcCopy = Object.assign({}, src.data);
      const nextState = _addNode(srcCopy, dest, dataCopy, state);
      const nextNextState = _deleteNode(src, dataCopy, state);

      return Object.assign({}, nextNextState);
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
      const displayType = action.displayType;

      return _reconstructTree(dataCopy, null, state, toggleCopy, displayType);
    }
    default: {
      return state;
    }
  }
}
