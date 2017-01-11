import * as d3 from 'd3';
import * as _ from 'lodash';

import { TREE_WIDTH, TREE_HEIGHT } from './constants';
import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType, SelectedEntity } from '../types';
import { attachIds } from './treeManipulator';

function _sortTree(root) {
  const sorter = (a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
  root.sort(sorter);
}

function _visit(node, args, preFn, postFn=(a, b) => 1) {
  if (node == null) return;

  preFn(node, args);
  const children = node.children || node._children;

  _.forEach(children, child => {
    _visit(child, args, preFn, postFn);
  });

  postFn(node, args);
}

// function _updateIdsByMids(root) {
//     const preVisitor = (node, mids) => {
//       mids.push(node.mid);
//       node.id = mids.join('.');
//     };

//     const postVisitor = (node, mids) => mids.pop();

//     _visit(root, [], preVisitor, postVisitor);
//   }

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
    return { node, parent }
  } else if (children) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const result = findNode(child, id, node);

      if (result !== null && result !== undefined) {
        return result
      }
    }
  } else {
    return null;
  }
};

export default function graphReducer(state = initialState.graph, action) {
  switch (action.type) {
    // case ActionTypes.ADD_NODE_SUCCESS: {
    //   return state;
    // }
    case ActionTypes.LOAD_GRAPH_SUCCESS: {
      const data = action.graph;
      attachIds(data);

      const tree = d3.tree().size([TREE_HEIGHT, TREE_WIDTH]);

      // const stratify = d3.stratify().parentId(d => {
      //   return d['id'].substring(0, d['id'].lastIndexOf('.'));
      // });

      // const root = stratify(data);
      const root = d3.hierarchy(data);

      _sortTree(root);
      tree(root);

      return Object.assign({}, state, {
        raw: data,
        treeRoot: root
      });
    }
    case ActionTypes.MOVE_NODE: {
      const dataCopy = Object.assign({}, state.raw);
      const { src, dest } = action;

      if (src.data.id == dest.data.id || src.parent.data.id == dest.data.id) {
        return state;
      }

      const srcFind = findNode(dataCopy, src.data.id);
      const srcInData = srcFind.node;
      const parentInData = srcFind.parent;
      const destFind = findNode(dataCopy, dest.data.id);
      const destInData = destFind.node;

      let childIndex;

      // delete child in parent
      _.forEach(parentInData.children, (child, index) => {
        if (child.id === src.data.id) {
          childIndex = index;
        }
      });

      parentInData.children.splice(childIndex, 1);

      // attach src to dest
      const destChildren = destInData.children || destInData._children;

      if (destChildren) {
        destInData.children.push(srcInData);
      } else {
        destInData.children = [srcInData];
      }

      // reconstruct the tree
      attachIds(dataCopy);
      const newRoot = d3.hierarchy(dataCopy);
      const tree = d3.tree().size([TREE_HEIGHT, TREE_WIDTH]);

      _sortTree(newRoot);
      tree(newRoot);

      return Object.assign({}, state, {
        raw: dataCopy,
        treeRoot: newRoot
      });
    }
    default: {
      return state;
    }
  }
}
