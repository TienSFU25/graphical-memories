import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType } from '../types';

export default function editBoxReducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.SHOW_EDIT: {
      const { htmlCoords } = action;
      return Object.assign({}, state,
        {
          show: true,
          htmlCoords
        });
    }
    default: {
      return state;
    }
  }
}
