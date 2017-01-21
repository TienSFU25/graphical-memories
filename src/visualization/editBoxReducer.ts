import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType } from '../types';

export default function editBoxReducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.SHOW_EDIT: {
      const { htmlCoords, value } = action;
      return Object.assign({}, state,
        {
          show: true,
          htmlCoords,
          value
        });
    }
    case ActionTypes.UPDATE_EDIT: {
      const { newValue } = action;
      return Object.assign({}, state, { value: newValue });
    }
    case ActionTypes.HIDE_EDIT: {
      return Object.assign({}, state,
        {
          show: false,
          value: ''
        });
    }
    default: {
      return state;
    }
  }
}
