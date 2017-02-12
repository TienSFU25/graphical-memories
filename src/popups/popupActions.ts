import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';

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
  showEditBox,
  hideEditBox
}

export default PopupActionsCreatorsMap;
