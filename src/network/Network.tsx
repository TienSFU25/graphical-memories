import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-bootstrap';

import graphManipulationActions from './graphManipulationActions';
import SelectedEntity from './SelectedEntity';
import SaveButton from './SaveButton';
// import LoadButton from './LoadButton';
import DataPanel from './DataPanel';

import '../css/app.scss';

class Network extends React.Component<any, any> {
  networkContainer: any;

  constructor(props) {
    super(props);

    this.state = {
      network: null
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  onSave() {

  }

  onDataUpdate(event: React.SyntheticEvent<any>) {

  }

  render() {
    return (
      <div>
        <div>This is the network</div>
        <SaveButton onClick={this.onSave.bind(this)} />
        <SelectedEntity />
        <DataPanel networkData={this.props.networkData} onChange={this.onDataUpdate.bind(this)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkData: state.networkData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
