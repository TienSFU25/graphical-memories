import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from './graphManipulationActions';
import SelectedEntity from './SelectedEntity';
// import LoadButton from './LoadButton';
import DataPanel from './DataPanel';

import '../css/app.scss';

class GraphMetadata extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  onDataUpdate(event: React.SyntheticEvent<any>) {

  }

  render() {
    return (
      <div>
        <SelectedEntity />
        <DataPanel networkData={this.props.networkData} onChange={this.onDataUpdate.bind(this)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphMetadata);
