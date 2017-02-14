import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { ZoomMode } from '../types';

export default function reducer(state = initialState.editBox, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_ZOOM: {
      const { zoomMode } = action;

      if (zoomMode === ZoomMode.None) {
        return false;
      } else if (zoomMode === ZoomMode.Normal) {
        return true;
      } else {
        console.error("WTF???");
        return null;
      }
    }
    default: {
      return state;
    }
  }
}
