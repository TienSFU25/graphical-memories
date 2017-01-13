import * as expect from 'expect';
import mainGraphReducer from './mainGraphReducer';
import initialState from '../app/initialState';
import { attachIds } from './treeManipulator';
import * as graphManipulationActions from '../graphMetadata/graphManipulationActions';
import * as loadGraphActions from '../graphMetadata/loadGraphActions';

describe('Main Graph Reducer', () => {
  beforeEach(() => {
    this.internalNode =
      {
        name: 'b',
        children: [
          {
            name: 'b1'
          },
          {
            name: 'b2'
          }
        ]
      };

    this.leafNode = { name: 'c2' };

    this.rawOne = {
      name: 'a',
      rid: 0,
      children: [
        this.internalNode,
        {
          name: 'c',
          children: [
            {
              name: 'c1'
            },
            this.leafNode
          ]
        }
      ]
    };

    this.internalNode2 =
      {
        name: 'e',
        children: [
          {
            name: 'e1'
          },
          {
            name: 'e2'
          }
        ]
      };

    this.leafNode2 = { name: 'f2' };

    this.rawOne = {
      name: 'd',
      rid: 1,
      children: [
        this.internalNode,
        {
          name: 'f',
          children: [
            {
              name: 'f1'
            },
            this.leafNode
          ]
        }
      ]
    };

    attachIds(this.rawOne);
    attachIds(this.rawTwo);

    const rawStateOne = Object.assign({}, initialState.graph, { raw: this.rawOne });
    const rawStateTwo = Object.assign({}, initialState.graph, { raw: this.rawOne });

    this.mockState = Object.assign({}, initialState.main, { subStates: [rawStateOne, rawStateTwo] });
  });

  it('should move node to a non-leaf when MOVE_NODE', () => {
    const action = graphManipulationActions.moveNode(this.leafNode2, this.internalNode);
    const newState = mainGraphReducer(this.mockState, action);

    // expect(newState.raw).toEqual(this.raw);
    expect(newState.subStates[1].treeRoot['descendants']().length).toEqual(7);
    expect(newState.subStates[2].treeRoot['leaves']().length).toEqual(4);
  });
})
