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
      showAdd: false,
      addX: 0,
      addY: 0,
      showEdit: false,
      showPopup: false,
      addValue: DEFAULT_NODE_NAME,
      editValue: ''
    };
  }

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;
    const handlers = {
      'tab': (e) => {
        self.addNode(self.state.addValue);
        e.preventDefault();
      },
      'enter': (e) => {
        self.addNode(self.state.addValue);
        e.preventDefault();
      }
    };

    this._handlerInstance = handlers;
    return handlers;
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

  onAdd(e) {
    this.setState({
      showAdd: true,
      addX: e.clientX,
      addY: e.clientY
    });
  }

  onDelete() {
    const node = this.props.selectedEntity.node;
    this.props.actions.deleteNode(node);
  }

  addNode(newNodeName) {
    const newNode = { name: newNodeName };
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.selectedEntity.node;
    this.props.actions.addNode(newNode, destNode);

    this.setState({
      showAdd: false,
      addValue: DEFAULT_NODE_NAME
    });
  }

  expand() {
    this.setState({
      showPopup: true
    });
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

    let addStyle = { visibility: 'hidden', top: 0, left: 0, zIndex: 0 };
    let inputStyle = { visibility: 'hidden', top: 0, left: 0 };
    let editBoxStyle = { visibility: 'hidden', top: 0, left: 0 };

    if (this.state.showAdd) {
      addStyle = {
        top: this.state.addY + window.pageYOffset,
        left: this.state.addX,
        zIndex: 1,
        visibility: 'visible'
      };
    }

    if (editBox && editBox.show) {
      inputStyle.top = editBox.htmlCoords.y + window.pageYOffset;
      inputStyle.left = editBox.htmlCoords.x;

      editBoxStyle.top = editBox.htmlCoords.y + window.pageYOffset;
      editBoxStyle.left = editBox.htmlCoords.x;

      if (this.state.showPopup) {
        editBoxStyle.visibility = 'visible';
        inputStyle.visibility = 'hidden';
      } else {
        editBoxStyle.visibility = 'hidden';
        inputStyle.visibility = 'visible';
      }
    }

    return (
      <div>
        <EditBox value={this.state.editValue}
                onAdd={this.onAdd.bind(this)}
                onDelete={this.onDelete.bind(this)}
                onEdit={this.onChange.bind(this)}
                style={editBoxStyle} />
        <div className='edit box' style={inputStyle}>
          <HotKeyManager>
            <InputField autoFocus value={this.state.editValue} id='edit' onChange={this.onChange.bind(this)} />
          </HotKeyManager>
          <div className="expand" onClick={this.expand.bind(this)} />
        </div>
        <HotKeys handlers={this.getHandlerInstance()}>
          <InputField autoFocus={this.state.showAdd} value={this.state.addValue} className='edit box' style={addStyle} id='add' onChange={this.onChange.bind(this)}/>
        </HotKeys>
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
