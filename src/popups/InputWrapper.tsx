import * as React from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import EditBox from '../popups/EditBox';
import InputField from '../shared/InputField';
import HotKeyManager from '../visualization/HotKeyManager';
import keyCodes from '../shared/keyCodes';
import { toHtmlCoords } from '../shared/svgHelper';

const DEFAULT_NODE_NAME = 'default';

class InputWrapper extends React.Component<any, any> {
  private _handlerInstance;

  constructor(props) {
    super(props);

    this.state = {
      showEdit: false,
      editValue: ''
    };
  }

  onChange(id, value) {
    const newState = {};

    newState[`${id}Value`] = value;
    this.setState(newState);
  }

  saveCurrentNode() {
    // save current node if any. also hides the box
    const prevNode = this.props.selectedEntity.node;

    if (prevNode.data.name !== this.state.editValue) {
      this.props.actions.editNode(prevNode, { name: this.state.editValue });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedEntity.node) {
      const currNode = this.props.selectedEntity.node;

      // autosave
      if (currNode && currNode !== nextProps.selectedEntity.node) {
        this.saveCurrentNode();
      }

      this.setState({
        editValue: nextProps.selectedEntity.node.data.name
      });
    }
  }

  render() {
    const { editBox } = this.props;

    let inputStyle = { visibility: 'hidden', top: 0, left: 0 };

    if (editBox && editBox.show) {
      inputStyle.top = editBox.htmlCoords.y + window.pageYOffset;
      inputStyle.left = editBox.htmlCoords.x;
      inputStyle.visibility = 'visible';
    }

    return (
      <div className='edit box' style={inputStyle}>
        <HotKeyManager>
          <InputField autoFocus value={this.state.editValue} id='edit' onChange={this.onChange.bind(this)} />
        </HotKeyManager>
      </div>
    );
  }
}

function mapStateToProps({ selectedEntity, editBox }) {
  return {
    selectedEntity,
    editBox
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InputWrapper);
