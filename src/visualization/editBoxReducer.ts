import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType } from '../types';

export default function editBoxReducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.SHOW_EDIT: {
      const { htmlCoords } = action;
      return Object.assign({}, state,
        {
          popup: false,
          show: true,
          htmlCoords
        });
    }
    case ActionTypes.HIDE_EDIT: {
      return Object.assign({}, state,
        {
          popup: false,
          show: false
        });
    }
    case ActionTypes.SHOW_ADD: {
      const { addCoords } = action;
      return Object.assign({}, state,
        {
          showAdd: true,
          addCoords
        });
    }
    case ActionTypes.HIDE_ADD: {
      return Object.assign({}, state,
        {
          showAdd: false
        });
    }
    case ActionTypes.SHOW_POPUP: {
      const { htmlCoords } = action;
      return Object.assign({}, state,
        {
          show: false,
          popup: true,
          htmlCoords
        });
    }
    default: {
      return state;
    }
  }
}
