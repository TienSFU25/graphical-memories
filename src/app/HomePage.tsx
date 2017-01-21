import * as React from 'react';
import { Col, Row, Jumbotron} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import GraphMetadata from '../graphMetadata/GraphMetadata';
import Visualizer from '../visualization/Content';
import EditBox from '../visualization/EditBox';

class HomePage extends React.Component<any, any> {
  onSave(value) {
    this.props.actions.editNode(this.props.selectedEntity.node, { name: value });
  }

  render() {
    const nodeName = this.props.editBox.value;

    return (
      <div>
        <EditBox htmlCoords={this.props.editBox.htmlCoords} show={this.props.editBox.show} onSave={this.onSave.bind(this)} value={nodeName}/>
        <Jumbotron>
          <h2>Ruby is learning Python!</h2>
        </Jumbotron>
        <Row>
          <Col sm={9}>
            <Visualizer />
          </Col>
          <Col sm={3}>
           {/* <GraphMetadata /> */}
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ selectedEntity, editBox }) {
  return {
    selectedEntity,
    editBox
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
