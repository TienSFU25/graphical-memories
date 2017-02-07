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

class InputWrapper extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      showEdit: false,
      showPopup: false
    };
  }

  saveCurrentNode(nodeData) {
    // save current node if any. also hides the box
    const prevNode = this.props.selectedEntity.node;

    if (prevNode.data.name !== nodeData.name) {
      this.props.actions.editNode(prevNode, nodeData);
    }
  }

  onAdd(e) {
    this.props.popupActions.showAddBox({
      x: e.clientX,
      y: e.clientY
    });
  }

  onDelete() {
    const node = this.props.selectedEntity.node;
    this.props.actions.deleteNode(node);
  }

  inputKeyHandler(event) {
    switch (event.which) {
      case keyCodes.LEFT: {
        const currNode = this.props.selectedEntity.node;
        const parent = currNode.parent;

        if (parent) {
          this.props.actions.selectNode(parent);
          // const parentCoords = toHtmlCoords(parent);
          // this.props.popupActions.showEditBox(parentCoords);
        }

        event.preventDefault();
      }
      default: {
        // do nothing
      }
    }
  }

  addNode(newNode) {
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.selectedEntity.node;
    this.props.actions.addNode(newNode, destNode);
    this.props.popupActions.hideAddBox();
  }

  expand() {
    this.setState({
      showPopup: true
    });
  }

  render() {
    const { editBox } = this.props;
    const nodeName = this.props.selectedEntity.node ? this.props.selectedEntity.node.data.name : '';

    let addStyle = {};
    let style;
    let inputHidden = 'hide';
    let EditPopup = <div />;

    if (editBox.showAdd) {
      addStyle = {
        top: this.props.editBox.addCoords.y + window.pageYOffset,
        left: this.props.editBox.addCoords.x,
        zIndex: 3
      };
    }

    if (editBox && editBox.show) {
      style = {
        top: editBox.htmlCoords.y + window.pageYOffset,
        left: editBox.htmlCoords.x
      };

      if (this.state.showPopup) {
        EditPopup = <EditBox htmlCoords={this.props.editBox.htmlCoords}
                          node={this.props.selectedEntity.node}
                          onAdd={this.onAdd.bind(this)}
                          onDelete={this.onDelete.bind(this)}
                          onSave={this.saveCurrentNode.bind(this)} />
      } else {
        inputHidden = '';
      }
    }

    return (
      <div>
        {EditPopup}
        <div className={'edit box ' + inputHidden} style={style}>
          <HotKeyManager>
            <InputField autoFocus show value={nodeName} onSave={this.saveCurrentNode.bind(this)} />
          </HotKeyManager>
          <div className="expand" onClick={this.expand.bind(this)} />
        </div>
        <InputField autoFocus show={editBox.showAdd} value='default' className='edit box' style={addStyle} onSave={this.addNode.bind(this)} />
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
