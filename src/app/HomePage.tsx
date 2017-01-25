import * as React from 'react';
import { Col, Row, Jumbotron} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import GraphMetadata from '../graphMetadata/GraphMetadata';
import Visualizer from '../visualization/Content';
import EditBox from '../visualization/EditBox';
import InputField from '../shared/InputField';

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

    this.props.actions.hideEditBox();
  }

  onAdd(e) {
    this.props.actions.showAddBox({
      x: e.clientX,
      y: e.clientY
    });
  }

  addNode(newNode) {
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.selectedEntity.node;
    this.props.actions.addNode(newNode, destNode);
    this.props.actions.hideAddBox();
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
        <EditBox show={this.props.editBox.popup} htmlCoords={this.props.editBox.htmlCoords} node={this.props.selectedEntity.node} onAdd={this.onAdd.bind(this)} onSave={this.saveCurrentNode.bind(this)} />
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Row>
          <Col sm={9}>
            <Visualizer />
          </Col>
          <Col sm={3}>
           {/* <GraphMetadata /> */}
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
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
