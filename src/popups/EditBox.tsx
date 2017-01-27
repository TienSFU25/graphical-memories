import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';
import InputField from '../shared/InputField';
import graphManipulationActions from '../graphMetadata/graphManipulationActions';

import '../css/edit.scss';

interface Coordinates {
  x: number;
  y: number;
}

interface Props {
  htmlCoords: Coordinates;
  className: string;
  onSave: Function;
  actions: any;
  selectedEntity: any;
  node: any;
  onAdd: Function;
  onDelete: Function;
}

class EditBox extends React.Component<Props, any> {
  collapseNode() {
    this.props.actions.toggleNode(this.props.selectedEntity.node);
  }

  onClickAdd(e) {
    this.props.onAdd(e);
  }

  onClickDelete() {
    this.props.onDelete();
  }

  render() {
    const allRows = [];
    const currNode: d3Node = this.props.selectedEntity.node;

    const style = {
      top: this.props.htmlCoords.y + window.pageYOffset,
      left: this.props.htmlCoords.x
    };

    const EditBox = (
      <Form horizontal className={`edit ${this.props.className}`} style={style} >
        <Row>
          <Col sm={4}>
            <div className='icon add' onClick={this.onClickAdd.bind(this)} />
          </Col>
          <Col sm={4}>
            <div className='icon delete' onClick={this.onClickDelete.bind(this)}/>
          </Col>
          <Col sm={4}>
            <div className='icon -collapse' onClick={this.collapseNode.bind(this)}/>
          </Col>
        </Row>
        <FormGroup controlId='id'>
          <Col componentClass={ControlLabel} sm={2}>
            id
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={currNode.data.id} />
          </Col>
        </FormGroup>
        <FormGroup controlId='name'>
          <Col componentClass={ControlLabel} sm={2}>
            name
          </Col>
          <Col sm={10}>
            <InputField show autoFocus={false} value={currNode.data.name} className='form-control' style={{}} onSave={this.props.onSave.bind(this)}/>
          </Col>
        </FormGroup>
      </Form>
    )

    return EditBox;
  }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(EditBox);
