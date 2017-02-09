import { Action, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { getImages } from './openClipartApi';
import { mapOpenClipArtResponseToImages } from '../dataMappers';

function getImageSuccess(imageList) {
  return {
    type: ActionTypes.LOAD_IMAGES_SUCCESS,
    imageList
  }
}

export function getCarouselImages(keyword = 'valentines') {
  return function(dispatch) {
    return getImages(keyword).then(response => {
      const imageList = mapOpenClipArtResponseToImages(response);
      dispatch(getImageSuccess(imageList));
    });
  }
}

const ActionsCreatorsMap: ActionCreatorsMapObject = {
  getCarouselImages
}

export default ActionsCreatorsMap;
