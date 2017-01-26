import * as expect from 'expect';
import * as _ from 'lodash';

import graphReducer from './graphReducer';
import { emptyTree } from '../app/initialState';
import { TreeHelper } from './treeHelper';
import { findNode, findNodeByName } from './treeManipulator';
import * as graphManipulationActions from '../graphMetadata/graphManipulationActions';
import * as loadGraphActions from '../graphMetadata/loadGraphActions';

describe('Graph Reducer', () => {
  before(() => {
    this.root = {};
    this.raw = {};
  })

  beforeEach(() => {
    const [raw, root, internal, leaf]  = TreeHelper.generateTree(6, 0);

    this.root = root;
    this.internal = internal;
    this.raw = raw;
    this.leaf = leaf;

    this.mockState = Object.assign({}, emptyTree, { raw: raw, type: 'tree', treeRoot: root });
  });

  it('should generate a simple tree when LOAD_GRAPH_SUCCESS', () => {
    const data = {
      name: 'a',
      children: [
        {
          name: 'b'
        },
        {
          name: 'c'
        }
      ]
    };

    const action = loadGraphActions.loadGraphSuccess(data);
    const newState = graphReducer(emptyTree, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot.descendants().length).toEqual(3);
    expect(newState.treeRoot.leaves().length).toEqual(2);
  });

  it('should generate a tree with just a root when data is empty for LOAD_GRAPH_SUCCESS', () => {
    const data = {};

    const action = loadGraphActions.loadGraphSuccess(data);
    const newState = graphReducer(emptyTree, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot.descendants().length).toEqual(1);
    expect(newState.treeRoot.leaves().length).toEqual(1);
  });

  it('should generate a tree with just a root when data has one item for LOAD_GRAPH_SUCCESS', () => {
    const data = {
      name: 'a'
    };

    const action = loadGraphActions.loadGraphSuccess(data);
    const newState = graphReducer(emptyTree, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot.descendants().length).toEqual(1);
    expect(newState.treeRoot.leaves().length).toEqual(1);
  });

  it('should add a node to valid leaf dest when ADD_NODE', () => {
    const newNode = {
      name: 'test!',
      value: 1
    };

    const action = graphManipulationActions.addNode(newNode, this.leaf);
    const newState = graphReducer(this.mockState, action);
    expect(newState.treeRoot.descendants().length).toEqual(8);
    expect(newState.treeRoot.leaves().length).toEqual(4);
  });

  it('should add a node to valid non-leaf dest when ADD_NODE', () => {
    const newNode = {
      name: 'test!',
      value: 1
    };

    const action = graphManipulationActions.addNode(newNode, this.internal);
    const newState = graphReducer(this.mockState, action);
    expect(newState.treeRoot.descendants().length).toEqual(8);
    expect(newState.treeRoot.leaves().length).toEqual(5);
  });

  it('should generate new id when ADD_NODE', () => {
    const newNode = {
      name: 'test!',
      value: 1
    };

    const action = graphManipulationActions.addNode(newNode, this.internal);
    const newState = graphReducer(this.mockState, action);

    const addedNode = findNodeByName(newState.raw, 'test!').node;
    expect(addedNode.id).toEqual(7);
  });

  it('should preserve old ids when ADD_NODE', () => {
    const newNode = {
      name: 'test!',
      value: 1
    };

    const action = graphManipulationActions.addNode(newNode, this.root);
    const newState = graphReducer(this.mockState, action);

    const oldD = findNode(newState.raw, 3).node;
    const oldF = findNode(newState.raw, 5).node;
    expect(oldD.name).toEqual('d');
    expect(oldF.name).toEqual('f');
  });

  it('should change the node value when EDIT_NODE', () => {
    const editData = {
      name: 'newname'
    };

    const action = graphManipulationActions.editNode(this.internal, editData);
    const newState = graphReducer(this.mockState, action);

    expect(_.findIndex(newState.treeRoot.descendants(), d => d.data.name == 'newname')).toBeGreaterThan(-1);
  });

  it('should delete a node with children when DELETE_NODE', () => {
    const action = graphManipulationActions.deleteNode(this.internal);
    const newState = graphReducer(this.mockState, action);
    expect(newState.treeRoot.descendants().length).toEqual(4);
    expect(newState.treeRoot.leaves().length).toEqual(2);
  });

  it('should delete a leaf when DELETE_NODE', () => {
    const action = graphManipulationActions.deleteNode(this.leaf);
    const newState = graphReducer(this.mockState, action);
    expect(newState.treeRoot.descendants().length).toEqual(6);
    expect(newState.treeRoot.leaves().length).toEqual(3);
  });

  it('should return empty root when DELETE_NODE on root', () => {
    const action = graphManipulationActions.deleteNode(this.root);
    const newState = graphReducer(this.mockState, action);
    expect(newState).toEqual(emptyTree);
  });

  it('should shuffle children to _children when TOGGLE_NODE', () => {
    const action = graphManipulationActions.toggleNode(this.internal);
    const newState = graphReducer(this.mockState, action);
    const internalNodeId = this.internal.data.id;
    const numChildren = this.internal.children.length;

    const internalAfterReduction = findNode(newState.treeRoot, internalNodeId).node;
    expect(internalAfterReduction.children).toBe(null);
    expect(internalAfterReduction._children.length).toBe(numChildren);
  });

  it('should shuffle _children back to children when TOGGLE_NODE twice', () => {
    const action = graphManipulationActions.toggleNode(this.internal);
    const newState = graphReducer(this.mockState, action);
    const newerState = graphReducer(newState, action);

    const internalNodeId = this.internal.data.id;
    const numChildren = this.internal.children.length;

    const internalAfterToggleTwice = findNode(newerState.treeRoot, internalNodeId).node;
    expect(internalAfterToggleTwice._children).toBe(undefined);
    expect(internalAfterToggleTwice.children.length).toBe(numChildren);
  });

  it('should attach image to a node when ATTACH_IMAGE', () => {
    const imageLink = 'http://whatever';
    const nodeId = this.leaf.data.id;

    const action = graphManipulationActions.attachImageToNode(imageLink, this.leaf);
    const newState = graphReducer(this.mockState, action);

    const nodeWithImage = findNode(newState.raw, nodeId).node;
    expect(nodeWithImage.image).toEqual(imageLink);
  });

  it('should override old image when ATTACH_IMAGE', () => {
    const imageLink = 'http://whatever';
    const newerImageLink = 'http://igiveashit';
    const nodeId = this.leaf.data.id;

    const action = graphManipulationActions.attachImageToNode(imageLink, this.leaf);
    const newState = graphReducer(this.mockState, action);
    const nextAction = graphManipulationActions.attachImageToNode(newerImageLink, this.leaf);
    const newerState = graphReducer(newState, nextAction);

    const nodeWithImage = findNode(newerState.raw, nodeId).node;
    expect(nodeWithImage.image).toEqual(newerImageLink);
  });
});
