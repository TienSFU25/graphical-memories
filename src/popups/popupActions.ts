import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { d3Node } from '../types';
import { toHtmlCoords } from '../shared/svgHelper';

// export function setEditCoords(node) {
  // const htmlCoords = toHtmlCoords(node);

  // return {
    // type: ActionTypes.SET_EDIT_COORDS,
    // htmlCoords
  // };
// }

export function showEditBox() {
  return {
    type: ActionTypes.SHOW_EDIT
  };
}

export function hideEditBox() {
  return {
    type: ActionTypes.HIDE_EDIT
  };
}

const PopupActionsCreatorsMap: ActionCreatorsMapObject = {
  // setEditCoords
  showEditBox,
  hideEditBox
}

export default PopupActionsCreatorsMap;
