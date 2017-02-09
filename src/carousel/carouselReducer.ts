import { ActionTypes } from '../app/actionTypes';
import initialState from '../app/initialState';
import { EntityType, SelectedEntity } from '../types';

export default function carouselReducer(state = initialState.carouselImages, action) {
  switch (action.type) {
    case ActionTypes.LOAD_IMAGES_SUCCESS: {
      const { imageList } = action;
      return Object.assign([], imageList);
    }
    default: {
      return state;
    }
  }
}
