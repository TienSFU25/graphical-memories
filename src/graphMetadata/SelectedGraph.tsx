import * as React from 'react';
import { ControlLabel, Col, Form, FormControl, FormGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import { TreeType } from '../types';

const SelectedGraph = ({graphName, onGraphTypeChange}) => {
  return (
    <Form horizontal>
      <div className="details panel panel-info">
          <div className="panel-heading">
              <div>Graph options</div>
          </div>
          <div className="panel-body">
            <FormGroup controlId='graph-name'>
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl type="text" value={graphName} />
              </Col>
            </FormGroup>
            <FormGroup controlId='graph-mode'>
              <Col componentClass={ControlLabel} sm={2}>
                Type
              </Col>
              <Col sm={10}>
                <DropdownButton title="Graphmode" onSelect={onGraphTypeChange} id="graph-mode">
                  <MenuItem eventKey={TreeType.VerticalTree}>Vertical</MenuItem>
                  <MenuItem eventKey={TreeType.Radial}>Radial</MenuItem>
                  <MenuItem eventKey={TreeType.Collapsible}>Collapsible</MenuItem>
                </DropdownButton>
              </Col>
            </FormGroup>
          </div>
      </div>
    </Form>
  );
};

export default SelectedGraph;
