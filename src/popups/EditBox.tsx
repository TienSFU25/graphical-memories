import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';
import InputField from '../shared/InputField';
import graphManipulationActions from '../graphMetadata/graphManipulationActions';

interface Props {
  actions: any;
  selectedEntity: any;
  value: string;
  onAdd: Function;
  onDelete: Function;
  onEdit: Function;
  onSave: Function;
  show: boolean;
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

  onSave() {
    this.props.onSave();
  }

  render() {
    const allRows = [];

    if (this.props.show) {
      const currNode: d3Node = this.props.selectedEntity.node;

      const EditBox = (
        <Form horizontal>
          <div className="details panel panel-info">
              <div className="panel-heading">
                  <div>Panel</div>
              </div>
              <div className="panel-body">
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
                    <InputField autoFocus={this.props.show} id='edit' value={this.props.value} className='form-control' onChange={this.onChange.bind(this)} />
                  </Col>
                </FormGroup>
              </div>
              <div className="panel-action">
                  <button type="button" onClick={this.onClickAdd.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-plus"></span> Add</button>
                  <button type="button" onClick={this.collapseNode.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-share-alt"></span> Collapse</button>
                  <button type="button" onClick={this.onClickDelete.bind(this)} className="btn btn-warning"><span className="glyphicon glyphicon-trash"></span> Delete</button>
              </div>
              <div className="panel-action">
                  <button type="button" className="btn btn-primary" onClick={this.onSave.bind(this)}><span className="glyphicon glyphicon-ok"></span> Save</button>
                  <button type="button" ng-click="leaveEdit()" className="btn btn-default"><span className="glyphicon glyphicon-remove"></span> Cancel</button>
              </div>
          </div>
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
