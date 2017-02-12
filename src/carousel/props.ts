import { ActionCreator } from 'redux';

export type PropsFromState = {
  carouselImages: Array<any>;
}
export type PropsFromActions = {
  search: ActionCreator<any>;
}
export type PropsPassedIn = {
  //  container={this.svg} dragBehavior={this.dragBehavior} imageList={this.props.carouselImages} onSearch={this.onSearch.bind(this)}
  // container: SVGElement;
  dragBehavior: any;
}
