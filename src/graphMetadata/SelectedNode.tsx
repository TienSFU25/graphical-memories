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
import { EditMode } from '../types';

const DEFAULT_NODE_NAME = 'default';

class SelectedNode extends React.Component<any, any> {
  private _handlerInstance;

  constructor(props) {
    super(props);

    this.state = {
      addValue: '',
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
    // this.setState({
    //   showAdd: true,
    //   addX: e.clientX,
    //   addY: e.clientY
    // });
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
      addValue: DEFAULT_NODE_NAME
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedEntity.node) {
      const currNode = this.props.selectedEntity.node;

      // autosave
      if (currNode && currNode !== nextProps.selectedEntity.node) {
        this.saveCurrentNode();
        this.setState({
          editValue: nextProps.selectedEntity.node.data.name
        });
      }
    }
  }

  render() {
    return (
      <EditBox value={this.state.editValue}
              show={this.props.editMode === EditMode.Standard}
              onAdd={this.onAdd.bind(this)}
              onDelete={this.onDelete.bind(this)}
              onEdit={this.onChange.bind(this)}
              onSave={this.saveCurrentNode.bind(this)} />
    );
  }
}

function mapStateToProps({ selectedEntity, editBox, editMode }) {
  return {
    selectedEntity,
    editBox,
    editMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedNode);
