import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import ZoomOptions from './ZoomOptions';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

const actionCreators: PropsFromActions = {
  toggleZoom(zoomMode) {
    return {
      type: ActionTypes.TOGGLE_ZOOM,
      zoomMode
    };
  }
}

function mapStateToProps(): PropsFromState  {
  return {};
}

function mapActionsToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ZoomOptions);
