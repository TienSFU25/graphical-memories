import * as expect from 'expect';
import mainGraphReducer from './mainGraphReducer';
import initialState from '../app/initialState';
import { attachIds } from './treeManipulator';
import * as graphManipulationActions from '../graphMetadata/graphManipulationActions';
import * as loadGraphActions from '../graphMetadata/loadGraphActions';
import * as sinon from 'sinon';
import { TreeHelper } from './treeHelper';
import * as d3 from 'd3';

// returns a binary tree
const generateTree = (numberOfNodes, rid) => {
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

  while (leaf.children && leaf.children.length) {
    leaf = leaf.children[0];
  }

  return [d3Root, root, leaf];
}

describe('Main Graph Reducer', () => {
  before(() => {
    this.rootOne = {};
    this.rootTwo = {};
    this.leafOne = {};
    this.leafTwo = {};
  })

  beforeEach(() => {
    const [rootOne, rawOne, leafOne]  = generateTree(6, 0);
    const [rootTwo, rawTwo, leafTwo] = generateTree(6, 1);

    this.rootOne = rootOne;
    this.rootTwo = rootTwo;
    this.leafOne = leafOne;
    this.leafTwo = leafTwo;

    const rawStateOne = Object.assign({}, initialState.graph, { raw: rawOne, type: 'tree', treeRoot: rootOne });
    const rawStateTwo = Object.assign({}, initialState.graph, { raw: rawTwo, type: 'tree', treeRoot: rootTwo });

    this.stub = sinon.stub(TreeHelper, 'getRid')
      .withArgs(this.rootOne).returns(0)
      .withArgs(this.leafOne).returns(0)
      .withArgs(this.rootTwo).returns(1)
      .withArgs(this.leafTwo).returns(1);

    this.mockState = Object.assign({}, initialState.main, { subStates: [rawStateOne, rawStateTwo] });
  });

  afterEach(() => {
    TreeHelper.getRid['restore']();
  });

  it('should move node to a non-leaf when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.leafTwo, this.rootOne);
    const newState = mainGraphReducer(this.mockState, action);

    expect(this.stub.callCount).toEqual(1);
    expect(newState.subStates[0].treeRoot['descendants']().length).toEqual(8);
    expect(newState.subStates[1].treeRoot['leaves']().length).toEqual(3);
  });

  it('should move node to a leaf when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.leafTwo, this.leafOne);
    const newState = mainGraphReducer(this.mockState, action);

    expect(this.stub.callCount).toEqual(1);
    expect(newState.subStates[0].treeRoot['descendants']().length).toEqual(8);
    expect(newState.subStates[1].treeRoot['leaves']().length).toEqual(3);
  });

  it('should move a whole tree when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.rootOne, this.rootTwo);
    const newState = mainGraphReducer(this.mockState, action);

    expect(newState.subStates[0].treeRoot['descendants']().length).toEqual(14);
    expect(newState.subStates.length).toEqual(1);
  });
})
