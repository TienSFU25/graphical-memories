import * as React from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import Visualizer from '../visualization/Graph';
import EditBox from '../popups/EditBox';
import InputField from '../shared/InputField';

import '../css/app.scss';

class HomePage extends React.Component<any, any> {
  // onSave(value) {
  //   this.props.actions.editNode(this.props.selectedEntity.node, { name: value });
  // }

  saveCurrentNode(nodeData) {
    // save current node if any. also hides the box
    const prevNode = this.props.selectedEntity.node;

    if (prevNode.data.name !== nodeData.name) {
      this.props.actions.editNode(prevNode, nodeData);
    }

    this.props.popupActions.hideEditBox();
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

  addNode(newNode) {
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.selectedEntity.node;
    this.props.actions.addNode(newNode, destNode);
    this.props.popupActions.hideAddBox();
  }

  render() {
    const nodeName = this.props.selectedEntity.node ? this.props.selectedEntity.node.data.name : '';

    let style = {};
    if (this.props.editBox.show) {
      style = {
        top: this.props.editBox.htmlCoords.y + window.pageYOffset,
        left: this.props.editBox.htmlCoords.x
      };
    }

    let addStyle = {};
    if (this.props.editBox.showAdd) {
      addStyle = {
        top: this.props.editBox.addCoords.y + window.pageYOffset,
        left: this.props.editBox.addCoords.x,
        zIndex: 3
      };
    }

    return (
      <div>
        <InputField autoFocus show={this.props.editBox.show} value={nodeName} className='edit box' style={style} onSave={this.saveCurrentNode.bind(this)} />
        <InputField autoFocus show={this.props.editBox.showAdd} value='default' className='edit box' style={addStyle} onSave={this.addNode.bind(this)} />
        <EditBox show={this.props.editBox.popup} htmlCoords={this.props.editBox.htmlCoords} node={this.props.selectedEntity.node}
            onAdd={this.onAdd.bind(this)} onDelete={this.onDelete.bind(this)} onSave={this.saveCurrentNode.bind(this)} />
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Row>
          <Col sm={12}>
            <Visualizer />
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
