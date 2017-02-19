import * as React from 'react';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { EntityType } from '../types';
import graphManipulationActions from './graphManipulationActions';
import { popupActions } from '../popups';
import SelectedGraph from './SelectedGraph';
import SelectedNode from './SelectedNode';

const DEFAULT_NODE_NAME = 'default';

class SelectedEntity extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  onAdd() {
    const newNode = { name: DEFAULT_NODE_NAME };
    console.log(`trying to add newNode ${JSON.stringify(newNode)}`);
    const destNode = this.props.selectedEntity.node;
    this.props.actions.addNode(newNode, destNode);
  }

  onDelete() {
    const node = this.props.selectedEntity.node;
    this.props.actions.deleteNode(node);
  }

  onCollapse() {
    const currNode = this.props.selectedEntity.node;
    this.props.actions.toggleNode(currNode);
  }

  onSave(editValue) {
    const currNode = this.props.selectedEntity.node;
    this.props.actions.editNode(currNode, { name: editValue });
  }

  onGraphTypeChange(eventKey) {
    this.props.actions.toggleGraphType(eventKey);
  }

  onEditChange(eventKey) {
    this.props.popupActions.toggleEdit(eventKey);
  }

  onZoomChange(eventKey) {
    this.props.actions.toggleZoom(eventKey);
  }

  onCancel() {
    this.props.actions.selectGraph();
  }

  render() {
    if (this.props.selectedEntity.type === EntityType.Graph) {
      return <SelectedGraph onGraphTypeChange={this.onGraphTypeChange.bind(this)}
                            onEditChange={this.onEditChange.bind(this)}
                            onZoomChange={this.onZoomChange.bind(this)} />;
    } else if (this.props.selectedEntity.type === EntityType.Node) {
      return <SelectedNode node={this.props.selectedEntity.node}
                           onAdd={this.onAdd.bind(this)}
                           onSave={this.onSave.bind(this)}
                           onCancel={this.onCancel.bind(this)}
                           onCollapse={this.onCollapse.bind(this)}
                           onDelete={this.onDelete.bind(this)}
                           shouldFocus={!this.props.editBox.show} />;
    } else if (this.props.selectedEntity.type === EntityType.Nothing) {
      return <div>You havent selected shit!</div>;
    } else {
      return <div>Implement this bitch {this.props.selectedEntity.type}</div>;
    }
  }
}

function mapStateToProps({ selectedEntity, editBox }) {
  return {
    editBox,
    selectedEntity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEntity);
