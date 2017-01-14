import * as expect from 'expect';
import mainGraphReducer from './mainGraphReducer';
import { emptyTree } from '../app/initialState';
import initialState from '../app/initialState';
import * as graphManipulationActions from '../graphMetadata/graphManipulationActions';
import * as loadGraphActions from '../graphMetadata/loadGraphActions';
import * as sinon from 'sinon';
import { TreeHelper } from './treeHelper';
import * as d3 from 'd3';

describe('Main Graph Reducer', () => {
  before(() => {
    this.rootOne = {};
    this.rootTwo = {};
    this.leafOne = {};
    this.leafTwo = {};
  })

  beforeEach(() => {
    const [rawOne, rootOne, internalOne, leafOne]  = TreeHelper.generateTree(6, 0);
    const [rawTwo, rootTwo, internalTwo, leafTwo] = TreeHelper.generateTree(6, 1);

    this.rootOne = rootOne;
    this.rootTwo = rootTwo;
    this.leafOne = leafOne;
    this.leafTwo = leafTwo;

    const rawStateOne = Object.assign({}, emptyTree, { raw: rawOne, type: 'tree', treeRoot: rootOne });
    const rawStateTwo = Object.assign({}, emptyTree, { raw: rawTwo, type: 'tree', treeRoot: rootTwo });

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

  it('should forward to tree reducer when ADD_NODE', () => {
    const mockNode = {
      name: 'mocky'
    };
    const action = graphManipulationActions.addNode(mockNode, this.rawOne.id);
    const newState = mainGraphReducer(this.mockState, action);

    expect(newState.subStates[0].treeRoot.descendants().length).toEqual(8);
    expect(newState.subStates[1].treeRoot.leaves().length).toEqual(3);
  });

  it('should forward to tree reducer when DELETE_NODE', () => {
    const action = graphManipulationActions.deleteNode(this.leafOne.id);
    const newState = mainGraphReducer(this.mockState, action);

    expect(newState.subStates[0].treeRoot.descendants().length).toEqual(8);
  });

  it('should move node to a non-leaf when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.leafTwo, this.rootOne);
    const newState = mainGraphReducer(this.mockState, action);

    expect(this.stub.callCount).toEqual(1);
    expect(newState.subStates[0].treeRoot.descendants().length).toEqual(8);
    expect(newState.subStates[1].treeRoot.leaves().length).toEqual(3);
  });

  it('should move node to a leaf when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.leafTwo, this.leafOne);
    const newState = mainGraphReducer(this.mockState, action);

    expect(this.stub.callCount).toEqual(1);
    expect(newState.subStates[0].treeRoot.descendants().length).toEqual(8);
    expect(newState.subStates[1].treeRoot.leaves().length).toEqual(3);
  });

  it('should move a whole tree when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.rootOne, this.rootTwo);
    const newState = mainGraphReducer(this.mockState, action);

    expect(newState.subStates[0].treeRoot.descendants().length).toEqual(14);
    expect(newState.subStates.length).toEqual(1);
  });
})
