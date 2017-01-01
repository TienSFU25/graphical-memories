import * as React from 'react';
import {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SelectedNetwork from './SelectedNetwork';
import SelectedNode from './SelectedNode';

class Network extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.selectedEntity.type === 'Network') {
      return <SelectedNetwork />;
    } else if (this.props.selectedEntity.type === 'Node') {
      return <SelectedNode data={this.props.selectedEntity.data} />;
    } else if (this.props.selectedEntity.type === 'Nothing') {
      return <div>You havent selected shit!</div>;
    } else {
      return <div>Implement this bitch {this.props.selectedEntity.type}</div>;
    }
  }
}

function mapStateToProps(state) {
  let selectedEntity = state.selectedEntity;

  return {
    selectedEntity
  };
}

export default connect(mapStateToProps)(Network);
