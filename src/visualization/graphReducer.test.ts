import * as expect from 'expect';
import graphReducer from './graphReducer';
import initialState from '../app/initialState';
import { attachIds } from './treeManipulator';
import * as graphManipulationActions from '../graphMetadata/graphManipulationActions';
import * as loadGraphActions from '../graphMetadata/loadGraphActions';

describe('Graph Reducer', () => {
  beforeEach(() => {
    this.raw = {
      name: 'a',
      children: [
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
        },
        {
          name: 'c',
          children: [
            {
              name: 'c1'
            },
            {
              name: 'c2'
            }
          ]
        }
      ]
    };

    attachIds(this.raw);

    this.srcNode = {
      parent: {
        data: {
          id: 0
        }
      },
      data: {
        id: 2
      }
    };
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
    const newState = graphReducer(initialState.graph, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot['descendants']().length).toEqual(3);
    expect(newState.treeRoot['leaves']().length).toEqual(2);
  });

  it('should generate a tree with just a root when data is empty for LOAD_GRAPH_SUCCESS', () => {
    const data = {};

    const action = loadGraphActions.loadGraphSuccess(data);
    const newState = graphReducer(initialState.graph, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot['descendants']().length).toEqual(1);
    expect(newState.treeRoot['leaves']().length).toEqual(1);
  });

  it('should generate a tree with just a root when data has one item for LOAD_GRAPH_SUCCESS', () => {
    const data = {
      name: 'a'
    };

    const action = loadGraphActions.loadGraphSuccess(data);
    const newState = graphReducer(initialState.graph, action);

    expect(newState.raw).toEqual(data);
    expect(newState.treeRoot['descendants']().length).toEqual(1);
    expect(newState.treeRoot['leaves']().length).toEqual(1);
  });

  it('should generate move node to a non-leaf when MOVE_NODE', () => {
    const initialGraphState = Object.assign({}, initialState.graph, { raw: this.raw });

    const destNode = {
      data: {
        id: 1
      }
    };

    const action = graphManipulationActions.moveNode(this.srcNode, destNode);
    const newState = graphReducer(initialGraphState, action);

    expect(newState.raw).toEqual(this.raw);
    expect(newState.treeRoot['descendants']().length).toEqual(7);
    expect(newState.treeRoot['leaves']().length).toEqual(4);
  });

  it('should generate move node to a leaf when MOVE_NODE', () => {
    const initialGraphState = Object.assign({}, initialState.graph, { raw: this.raw });

    const destNode = {
      data: {
        id: 4
      }
    };

    const action = graphManipulationActions.moveNode(this.srcNode, destNode);
    const newState = graphReducer(initialGraphState, action);

    expect(newState.raw).toEqual(this.raw);
    expect(newState.treeRoot['descendants']().length).toEqual(7);
    expect(newState.treeRoot['leaves']().length).toEqual(4);
  });

  it('should not do anything when MOVE_NODE to itself', () => {
    const initialGraphState = Object.assign({}, initialState.graph, { raw: this.raw });

    const action = graphManipulationActions.moveNode(this.srcNode, this.srcNode);
    const newState = graphReducer(initialGraphState, action);

    expect(newState).toEqual(initialGraphState);
  });

  it('should not do anything when MOVE_NODE to a parent', () => {
    const initialGraphState = Object.assign({}, initialState.graph, { raw: this.raw });

    const destNode = {
      data: {
        id: 0
      }
    };

    const action = graphManipulationActions.moveNode(this.srcNode, destNode);
    const newState = graphReducer(initialGraphState, action);

    expect(newState).toEqual(initialGraphState);
  });
});
