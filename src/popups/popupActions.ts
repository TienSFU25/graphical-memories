import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { d3Node } from '../types';

export function showEditBox(htmlCoords) {
  return {
    type: ActionTypes.SHOW_EDIT,
    htmlCoords
  };
}

export function hideEditBox() {
  return {
    type: ActionTypes.HIDE_EDIT
  };
}

export function showAddBox(addCoords) {
  return {
    type: ActionTypes.SHOW_ADD,
    addCoords
  };
}

export function hideAddBox() {
  return {
    type: ActionTypes.HIDE_ADD
  };
}


export function showPopup(htmlCoords) {
  return {
    type: ActionTypes.SHOW_POPUP,
    htmlCoords
  }
}

const PopupActionsCreatorsMap: ActionCreatorsMapObject = {
  showEditBox,
  hideEditBox,
  showAddBox,
  hideAddBox,
  showPopup
}

export default PopupActionsCreatorsMap;
