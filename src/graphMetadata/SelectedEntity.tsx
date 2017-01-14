import * as React from 'react';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { EntityType } from '../types';
import graphManipulationActions from './graphManipulationActions';
import SelectedGraph from './SelectedGraph';
import SelectedNode from './SelectedNode';

class SelectedEntity extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  onNodeChange(event: React.SyntheticEvent<any>) {
    // const fieldName = event.currentTarget.labels[0].textContent;
    // const nodeId = event.currentTarget.labels[1].textContent;
    // const val = event.currentTarget.value;

    // this.props.actions.editNode(nodeId, fieldName, val);
    console.log('Implement the on node change in selectedEntity!');
  }

  onSave() {

  }

  render() {
    if (this.props.selectedEntity.type === EntityType.Graph) {
      return <SelectedGraph />;
    } else if (this.props.selectedEntity.type === EntityType.Node) {
      return <SelectedNode onChange={this.onNodeChange.bind(this)} data={this.props.selectedEntity.node} />;
    } else if (this.props.selectedEntity.type === EntityType.Nothing) {
      return <div>You havent selected shit!</div>;
    } else {
      return <div>Implement this bitch {this.props.selectedEntity.type}</div>;
    }
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEntity);
