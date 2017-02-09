import { Action, ActionCreatorsMapObject } from 'redux';
import { ActionTypes } from '../app/actionTypes';
import { getImages } from './openClipartApi';

function getImageSuccess(imageList) {
  return {
    type: ActionTypes.LOAD_IMAGES_SUCCESS,
    imageList
  }
}

export function initCarouselImages() {
  return function(dispatch) {
    return getImages().then(images => {
      dispatch(getImageSuccess(images));
    }).catch(err => {
      throw(err);
    });
  }
}

const ActionsCreatorsMap: ActionCreatorsMapObject = {
  initCarouselImages
}

export default ActionsCreatorsMap;
