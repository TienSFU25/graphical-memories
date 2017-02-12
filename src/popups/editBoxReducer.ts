import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType } from '../types';

export default function editBoxReducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.SET_EDIT_COORDS: {
      // const { htmlCoords } = action;
      // return Object.assign({}, state,
      //   {
      //     htmlCoords
      //   });
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
    // case ActionTypes.SELECT_NODE: {
    //   return Object.assign({}, state,
    //     {
    //       show: false,
    //       showAdd: false
    //     });
    // }
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
