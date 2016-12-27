import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function helloReducer(state = "", action) {
  switch (action.type) {
    case types.SAY_HELLO_SUCCESS:
      return action.message;

    default:
      return state;
  }
}
