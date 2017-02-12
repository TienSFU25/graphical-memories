import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import HotkeyWrapper from './HotkeyWrapper';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

const actionCreators: PropsFromActions = {
  showEditBox() {
    return {
      type: ActionTypes.SHOW_EDIT
    };
  },

  hideEditBox() {
    return {
      type: ActionTypes.HIDE_EDIT
    };
  }
};

function mapStateToProps ({graph}): PropsFromState  {
    return {
      graph
    };
}

function mapDispatchToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotkeyWrapper);
