import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import InputWrapperComponent from './InputWrapper';
import { toHtmlCoords } from '../shared/svgHelper';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

const actionCreators: PropsFromActions = {
  toggleEdit(editMode) {
    return {
      type: ActionTypes.TOGGLE_EDIT,
      editMode
    };
  },
  showEdit() {
    return {
      type: ActionTypes.SHOW_EDIT
    }
  },
  hideEdit() {
    return {
      type: ActionTypes.HIDE_EDIT
    }
  },
  editNode(node, editData) {
    return {
      type: ActionTypes.EDIT_NODE,
      node,
      editData
    }
  },
  selectNode(node) {
    const htmlCoords = toHtmlCoords(node);

    return {
      type: ActionTypes.SELECT_NODE,
      htmlCoords,
      node
    };
  }
}

function mapStateToProps({selectedEntity, editBox}): PropsFromState  {
  return {
    selectedNode: selectedEntity.node,
    shouldShowEditBox: editBox.show,
    htmlCoords: selectedEntity.htmlCoords
  };
}

function mapActionsToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators, dispatch)
}

const InputWrapper = connect(
  mapStateToProps,
  mapActionsToProps
)(InputWrapperComponent);

export { actionCreators as popupActions,  InputWrapper };
