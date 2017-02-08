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

const PopupActionsCreatorsMap: ActionCreatorsMapObject = {
  showEditBox,
  hideEditBox
}

export default PopupActionsCreatorsMap;
