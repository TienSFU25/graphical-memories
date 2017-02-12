import { ActionCreator } from 'redux';

export type PropsFromState = {}
export type PropsFromActions = {
}
export type PropsPassedIn = {
  //  container={this.svg} dragBehavior={this.dragBehavior} imageList={this.props.carouselImages} onSearch={this.onSearch.bind(this)}
  container: SVGElement;
  dragBehavior: any;
  imageList: Array<any>;
  onSearch: Function;
}
