import * as React from 'react';
import { ControlLabel, Col, Form, FormControl, FormGroup, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import InputField from '../shared/InputField';

export default class SelectedNode extends React.Component<any, any> {
  private _handlerInstance;

  constructor(props) {
    super(props);

    this.state = {
      editValue: ''
    };
  }

  onSave() {
    this.props.onSave(this.state.editValue);
  }

  onChange(id, value) {
    this.setState({
      editValue: value
    });
  }

  componentDidMount() {
    this.setState({
      editValue: this.props.node.data.name
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('shit will receive props');
    if (nextProps.node) {
      this.setState({
        editValue: nextProps.node.data.name
      });
    }
  }

  render() {
    const currNode = this.props.node;

    let EditNodePanel;

    EditNodePanel = (
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
                    <InputField autoFocus={this.props.shouldFocus} id='edit' value={this.state.editValue} className='form-control' onChange={this.onChange.bind(this)} />
                  </Col>
                </FormGroup>
                <FormGroup controlId='value'>
                  <Col componentClass={ControlLabel} sm={2}>
                    value
                  </Col>
                  <Col sm={10}>
                    <InputField id='value' value={currNode.data.size} className='form-control' onChange={this.onChange.bind(this)} />
                  </Col>
                </FormGroup>
              </div>
              <div className="panel-action">
                  <button type="button" onClick={this.props.onAdd.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-plus"></span> Add</button>
                  <button type="button" onClick={this.props.onCollapse.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-share-alt"></span> Collapse</button>
                  <button type="button" onClick={this.props.onDelete.bind(this)} className="btn btn-warning"><span className="glyphicon glyphicon-trash"></span> Delete</button>
              </div>
              <div className="panel-action">
                  <button type="button" className="btn btn-primary" onClick={this.onSave.bind(this)}><span className="glyphicon glyphicon-ok"></span> Save</button>
                  <button type="button" className="btn btn-default" onClick={this.props.onCancel}><span className="glyphicon glyphicon-remove"></span> Cancel</button>
              </div>
          </div>
        </Form>
    );

    return EditNodePanel;
  }
}
