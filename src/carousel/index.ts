import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import { getImages } from './openClipartApi';
import { mapOpenClipArtResponseToImages } from '../dataMappers';
import Carousel from './Carousel';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

function getImageSuccess(imageList) {
  return {
    type: ActionTypes.LOAD_IMAGES_SUCCESS,
    imageList
  }
}

const actionCreators: PropsFromActions = {
  search(searchValue='valentines') {
    return function(dispatch) {
      return getImages(searchValue).then(response => {
        const imageList = mapOpenClipArtResponseToImages(response);
        dispatch(getImageSuccess(imageList));
      });
    }
  }
}

function mapStateToProps({ carouselImages }): PropsFromState  {
    return {
      carouselImages
    };
}

function mapActionsToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators, dispatch)
}

export { actionCreators as carouselActions };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(Carousel);
