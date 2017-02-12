import { ActionCreator } from 'redux';

export type PropsFromState = {
  graph: any;
}
export type PropsFromActions = {
  showEditBox: ActionCreator<any>;
  hideEditBox: ActionCreator<any>;
}
export type PropsPassedIn = {
  selectedNode: any;
  handler: Function;
}
