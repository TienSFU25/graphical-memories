import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EditMode } from '../types';
import { ActionTypes } from '../app/actionTypes';
import EditDropdown from './EditDropdown';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

function actionCreators (): PropsFromActions {
  return {
    toggleEdit(editMode) {
      // let actionType;

      // if (editMode == EditMode.Quick) {
      //   actionType = ActionTypes.SHOW_EDIT;
      // } else if (editMode == EditMode.Standard) {
      //   actionType = ActionTypes.HIDE_EDIT;
      // }

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
)(EditDropdown)
