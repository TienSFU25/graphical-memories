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
  // htmlCoords: Coordinates;
  // className: string;
  // onSave: Function;
  actions: any;
  selectedEntity: any;
  // node: any;
  value: string;
  onAdd: Function;
  onDelete: Function;
  onEdit: Function;
  style: Object;
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

  onChange(id, value) {
    this.props.onEdit(id, value);
  }

  render() {
    const allRows = [];
    const currNode: d3Node = this.props.selectedEntity.node;

    if (currNode) {
      const EditBox = (
        <Form horizontal className={`edit`} style={this.props.style} >
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
              <InputField autoFocus id='edit' value={this.props.value} className='form-control' onChange={this.onChange.bind(this)} />
            </Col>
          </FormGroup>
        </Form>
      )

      return EditBox;
    } else {
      return <div />
    }
  }
};

function mapStateToProps({ selectedEntity }) {
  return {
    selectedEntity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBox);
