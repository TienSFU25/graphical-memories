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

const DataPanel = ({networkData, onChange}) => {
  const prettyData = JSON.stringify(networkData);

  return (
    <FieldGroup id="data-panel" label="Data panel" bsClass="data-panel form-control" componentClass="textarea" value={prettyData} onChange={onChange} />
  );
};

export default DataPanel;
