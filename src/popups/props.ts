import { ActionCreator } from 'redux';

export type PropsFromState = {
  selectedNode: any,
  shouldShowEditBox: boolean,
  htmlCoords: any
}

export type PropsFromActions = {
  toggleEdit: ActionCreator<any>;
  showEdit: ActionCreator<any>;
  hideEdit: ActionCreator<any>;
  selectNode: ActionCreator<any>;
  editNode: ActionCreator<any>;
}

export type PropsPassedIn = {}
