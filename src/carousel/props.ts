import { ActionCreator } from 'redux';

export type PropsFromState = {
  carouselImages: Array<any>;
}
export type PropsFromActions = {
  search: ActionCreator<any>;
}
export type PropsPassedIn = {
  dragBehavior: any;
}
