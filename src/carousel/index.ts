import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import Carousel from './Carousel';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

function actionCreators (): PropsFromActions {
  return {
    toggleEdit(editMode) {
      return {
        type: ActionTypes.TOGGLE_EDIT,
        editMode
      };
    }
  };
}

function mapStateToProps (): PropsFromState  {
    return {
    };
}

function mapActionsToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators(), dispatch)
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Carousel);
