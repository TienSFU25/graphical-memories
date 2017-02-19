import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';

export default function reducer(state = initialState.toolTip, action) {
  switch (action.type) {
    case ActionTypes.SHOW_TOOLTIP: {
      const { htmlCoords, node } = action;

      return Object.assign({}, state, {
        show: true,
        htmlCoords,
        node
      });
    }
    case ActionTypes.HIDE_TOOLTIP: {
      return Object.assign({}, state, {
        show: false
      });
    }
    default: {
      return state;
    }
  }
}
