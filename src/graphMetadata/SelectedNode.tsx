import * as React from 'react';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import InputField from '../shared/InputField';
import HotKeyManager from '../visualization/HotKeyManager';
import keyCodes from '../shared/keyCodes';
import { toHtmlCoords } from '../shared/svgHelper';

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
    this.setState({
      editValue: value
    });
  }

  saveCurrentNode() {
    // save current node if any. also hides the box
    const prevNode = this.props.node;

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
    const node = this.props.node;
    this.props.actions.deleteNode(node);
  }

  onCollapse() {
    const currNode = this.props.node;
    this.props.actions.toggleNode(currNode);
  }

  onSave() {
    const currNode = this.props.node;
    this.props.actions.editNode(currNode, { name: this.state.editValue });
  }

  componentDidMount() {
    this.setState({
      editValue: this.props.node.data.name
    });
  }

  componentWillUpdate() {
    console.log('shit will update!');
  }

  addNode(newNodeName) {
    const newNode = { name: newNodeName };
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.node;
    this.props.actions.addNode(newNode, destNode);

    this.setState({
      addValue: DEFAULT_NODE_NAME
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('shit will receive props');
    if (nextProps.node) {
      // const currNode = this.props.node;

      // if (currNode && currNode !== nextProps.node) {
        // this.saveCurrentNode();
        this.setState({
          editValue: nextProps.node.data.name
        });
      // }
    }
  }

  render() {
    const currNode = this.props.node;

    // return (
    //   <EditBox value={this.state.editValue}
    //           show={!this.props.editBox.show}
    //           onAdd={this.onAdd.bind(this)}
    //           onDelete={this.onDelete.bind(this)}
    //           onEdit={this.onChange.bind(this)}
    //           onSave={this.saveCurrentNode.bind(this)} />
    // );

    let EditNodePanel;

    // if (this.props.editBox.show) {

    // } else {
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
                      <InputField autoFocus={!this.props.editBox.show} id='edit' value={this.state.editValue} className='form-control' onChange={this.onChange.bind(this)} />
                    </Col>
                  </FormGroup>
                </div>
                <div className="panel-action">
                    <button type="button" onClick={this.onAdd.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-plus"></span> Add</button>
                    <button type="button" onClick={this.onCollapse.bind(this)} className="btn btn-default"><span className="glyphicon glyphicon-share-alt"></span> Collapse</button>
                    <button type="button" onClick={this.onDelete.bind(this)} className="btn btn-warning"><span className="glyphicon glyphicon-trash"></span> Delete</button>
                </div>
                <div className="panel-action">
                    <button type="button" className="btn btn-primary" onClick={this.onSave.bind(this)}><span className="glyphicon glyphicon-ok"></span> Save</button>
                    <button type="button" ng-click="leaveEdit()" className="btn btn-default"><span className="glyphicon glyphicon-remove"></span> Cancel</button>
                </div>
            </div>
          </Form>
      );
    // }

    return EditNodePanel;
  }
}

function mapStateToProps({ editBox }) {
  return {
    // selectedEntity,
    editBox,
    // editMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedNode);
