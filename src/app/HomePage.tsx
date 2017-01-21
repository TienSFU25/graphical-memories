import * as React from 'react';
import { Col, Row, Jumbotron} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import GraphMetadata from '../graphMetadata/GraphMetadata';
import Visualizer from '../visualization/Content';
import EditBox from '../visualization/EditBox';

class HomePage extends React.Component<any, any> {
  render() {
    return (
      <div>
        <EditBox htmlCoords={this.props.editBox.htmlCoords} />
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

function mapStateToProps({ editBox }) {
  return {
    editBox
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
