import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EditMode } from '../types';

export default function reducer(state = initialState.editMode, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_EDIT: {
      const { editMode } = action;

      return editMode;
    }
    default: {
      return state;
    }
  }
}
