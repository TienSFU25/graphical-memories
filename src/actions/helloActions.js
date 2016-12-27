import * as types from './actionTypes';

export function sayHello() {
  return {
    type: types.SAY_HELLO_SUCCESS,
    message: 'hellooooo'
  }
}
