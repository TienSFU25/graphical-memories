import * as expect from 'expect';
import graphReducer from './graphReducer';
import { emptyTree } from '../app/initialState';
import { TreeHelper } from './treeHelper';
import { attachIds } from './treeManipulator';
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
});
