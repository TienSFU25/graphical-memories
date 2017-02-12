import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EditMode } from '../types';

function _getShouldShowEdit(editMode, state) {
  let shouldShowEdit = state.show;

  if (editMode === EditMode.Quick)
    shouldShowEdit = true;

  return shouldShowEdit;
}

export default function editBoxReducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.SET_EDIT_COORDS: {
      // const { htmlCoords } = action;
      // return Object.assign({}, state,
      //   {
      //     htmlCoords
      //   });
    }
    case ActionTypes.TOGGLE_EDIT: {
      const { editMode } = action;
      const shouldShowEdit = _getShouldShowEdit(editMode, state);

      return Object.assign({}, state, { editMode, show: shouldShowEdit });
    }
    case ActionTypes.HIDE_EDIT: {
      return Object.assign({}, state,
        {
          show: false
        });
    }
    case ActionTypes.SHOW_EDIT: {
      return Object.assign({}, state, {show: true});
    }
    case ActionTypes.SELECT_NODE: {
      const shouldShowEdit = _getShouldShowEdit(state.editMode, state);

      return Object.assign({}, state, { show: shouldShowEdit });
    }
    case ActionTypes.SELECT_GRAPH: {
      return Object.assign({}, state,
        {
          show: false
        });
    }
    default: {
      return state;
    }
  }
}
