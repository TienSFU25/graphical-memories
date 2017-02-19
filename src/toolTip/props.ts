import { ActionCreator } from 'redux';

export type PropsFromState = {
  node: any;
  isToolTipShown: boolean;
  x: number;
  y: number;
}
export type PropsFromActions = {
  showTooltip: ActionCreator<any>;
  hideTooltip: ActionCreator<any>;
}
export type PropsPassedIn = {
}
