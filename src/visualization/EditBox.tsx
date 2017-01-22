import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

require('./edit.scss');

interface Coordinates {
  x: number;
  y: number;
}

interface Props {
  value?: string;
  htmlCoords: Coordinates;
  show: boolean;
  isPopup: boolean;
  onSave: Function;
  actions: any;
  editBox: any;
  selectedEntity: any;
}

class EditBox extends React.Component<Props, any> {
  private editInput;

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  saveCurrentNode() {
    // save current node if any. also hides the box
    const value = this.state.value;
    const prevNode = this.props.selectedEntity.node;

    if (prevNode.data.name !== value) {
      this.props.actions.editNode(prevNode, { name: value });
    }

    this.props.actions.hideEditBox();
  }

  onBlur() {
    this.saveCurrentNode();
  }

  onChange(e) {
    const value = e.target.value;
    this.setState({
      value
    });
  }

  onKeyDown(e) {
    if (e.which === 13) {
      this.props.onSave(this.state.value);
      e.stopPropagation();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentDidUpdate() {
    if (this.props.show && !this.props.isPopup) {
      this.editInput.focus();
    }
  }

  _onDelete() {
    this.props.actions.deleteNode(this.props.selectedEntity.node);
  }

  _onAdd() {
    this.props.actions.addNode({name: 'ez'}, this.props.selectedEntity.node);
  }

  _toDataRow(key, value, readOnly = false) {
    const id = `edit-${key}`;
    return (
      <FormGroup controlId={id}>
        <Col componentClass={ControlLabel} sm={2}>
          {key}
        </Col>
        <Col sm={10}>
          <FormControl type="text" value={value} />
        </Col>
      </FormGroup>
    );
  }

  render() {
    const style = {
      top: this.props.htmlCoords.y + window.pageYOffset,
      left: this.props.htmlCoords.x
    };

    let EditBox = <div />;

    if (this.props.show) {
      if (this.props.isPopup) {
        const allRows = [];
        const currNode: d3Node = this.props.selectedEntity.node;

        const keys = ['id', 'name'];
        for (let validKey of keys) {
          allRows.push(this._toDataRow(validKey, currNode.data[validKey]));
        }

        EditBox = (
          <Form horizontal className='edit' style={style} >
            <Row>
              <Col sm={4}>
                <div className='icon add' />
              </Col>
              <Col sm={4}>
                <div className='icon delete' />
              </Col>
              <Col sm={4}>
                <div className='icon -collapse' />
              </Col>
            </Row>
            {allRows}
          </Form>
        )
      } else {
        EditBox = <input type="text" className='edit box' value={this.state.value} style={style} ref={(input) => this.editInput = input}
                    onChange={this.onChange.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onBlur={this.onBlur.bind(this)} />
      }
    }

    return EditBox;
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
