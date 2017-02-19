import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ActionTypes } from '../app/actionTypes';
import Tooltip from './Tooltip';
import { toHtmlCoords } from '../shared/svgHelper';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props';
import './style.scss';

const actionCreators: PropsFromActions = {
  showTooltip(node, coords) {
    return {
      type: ActionTypes.SHOW_TOOLTIP,
      htmlCoords: coords,
      node
    };
  },
  hideTooltip() {
    return {
      type: ActionTypes.HIDE_TOOLTIP
    };
  }
}

function mapStateToProps({ toolTip }): PropsFromState {
  const { show, htmlCoords } = toolTip;
  return { isToolTipShown: show, x: htmlCoords.x, y: htmlCoords.y, node: toolTip.node };
}

function mapActionsToProps (dispatch: Dispatch<{}>, props: PropsPassedIn): PropsFromActions {
  return bindActionCreators(actionCreators, dispatch)
}

export { actionCreators as tooltipActions };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(Tooltip);
