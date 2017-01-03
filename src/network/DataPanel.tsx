import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

function FieldGroup({ id, label, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

const DataPanel = ({networkData}) => {
  const prettyData = JSON.stringify(networkData);

  return (
    <FieldGroup id="data-panel" label="Data panel" bsClass="data-panel form-control" componentClass="textarea" value={prettyData}/>
  );
};

export default DataPanel;
