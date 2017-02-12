import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import InputField from '../shared/InputField';
import HotKeyManager from '../visualization/HotKeyManager';

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
      this.setState({
        editValue: nextProps.selectedEntity.node.data.name
      });
    }
  }

  handleHotKeys(node) {
    const currNode = this.props.selectedEntity.node;

    // autosave
    if (currNode && currNode !== node) {
      this.saveCurrentNode();
    }

    this.props.actions.selectNode(node);
  }

  render() {
    const { editBox, selectedEntity } = this.props;

    let inputStyle = { visibility: 'hidden', top: 0, left: 0 };

    if (editBox && editBox.show) {
      inputStyle.top = selectedEntity.htmlCoords.y + window.pageYOffset;
      inputStyle.left = selectedEntity.htmlCoords.x;
      inputStyle.visibility = 'visible';
    }

    return (
      <div className='edit box' style={inputStyle}>
        <HotKeyManager selectedNode={this.props.selectedEntity.node} handler={this.handleHotKeys.bind(this)}>
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
