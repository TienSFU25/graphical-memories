import * as React from 'react';
import { ControlLabel, Col, Form, FormControl, FormGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import { EditMode, ZoomMode, TreeType } from '../types';

const SelectedGraph = ({onGraphTypeChange, onEditChange, onZoomChange}) => {
  return (
    <Form horizontal>
      <div className="details panel panel-info">
          <div className="panel-heading">
              <div>Graph options</div>
          </div>
          <div className="panel-body">
            <FormGroup controlId='graph-mode'>
              <Col componentClass={ControlLabel} sm={2}>
                Type
              </Col>
              <Col sm={10}>
                <DropdownButton title="Graphmode" onSelect={onGraphTypeChange} id="graph-mode">
                  <MenuItem eventKey={TreeType.VerticalTree}>Vertical</MenuItem>
                  <MenuItem eventKey={TreeType.Radial}>Radial</MenuItem>
                  <MenuItem eventKey={TreeType.Collapsible}>Collapsible</MenuItem>
                  <MenuItem eventKey={TreeType.LinkText}>Colorful!</MenuItem>
                </DropdownButton>
              </Col>
            </FormGroup>
            <FormGroup controlId='edit-mode'>
              <Col componentClass={ControlLabel} sm={2}>
                Edit mode
              </Col>
              <Col sm={10}>
                <DropdownButton title="Edit" onSelect={onEditChange} id="edit-mode">
                  <MenuItem eventKey={EditMode.Standard}>Standard</MenuItem>
                  <MenuItem eventKey={EditMode.Quick}>Quick</MenuItem>
                </DropdownButton>
              </Col>
            </FormGroup>
            <FormGroup controlId='zoom-mode'>
              <Col componentClass={ControlLabel} sm={2}>
                Zoom mode
              </Col>
              <Col sm={10}>
                <DropdownButton title="Zoom" onSelect={onZoomChange} id="zoom-mode">
                  <MenuItem eventKey={ZoomMode.None}>None</MenuItem>
                  <MenuItem eventKey={ZoomMode.Normal}>Normal</MenuItem>
                </DropdownButton>
              </Col>
            </FormGroup>
          </div>
      </div>
    </Form>
  );
};

export default SelectedGraph;
