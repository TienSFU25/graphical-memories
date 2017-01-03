import * as React from 'react';
import { ControlLabel, FormControl, FormGroup, Table } from 'react-bootstrap';
import { Node } from 'vis';

function FieldGroup({ data, mode = "edit", fieldName, ...props }) {
  const id = mode + '-' + fieldName;
  const label = fieldName;
  const nodeId = data.id;
  const value = data[label];

  return (
    <FormGroup controlId={id}>
      <ControlLabel className="hide">{label}</ControlLabel>
      <ControlLabel className="hide">{nodeId}</ControlLabel>
      <FormControl type="text" id={id} value={value} {...props} />
    </FormGroup>
  );
}

const SelectedNode : React.StatelessComponent<React.HTMLProps<JSX.Element>> = (props: React.HTMLProps<JSX.Element> & {data: Node} & {onSave: any} & {onChange: any}) => {
  const data = props.data;
  const onSave = props.onSave;
  const onChange = props.onChange;

  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>id</td>
          <td><FieldGroup data={data} fieldName="id" onChange={onChange} readonly/></td>
        </tr>
        <tr>
          <td>label</td>
          <td><FieldGroup data={data} fieldName="label" onChange={onChange} /></td>
        </tr>
        <tr>
          <td>x</td>
          <td><FieldGroup data={data} fieldName="x" onChange={onChange} /></td>
        </tr>
        <tr>
          <td>y</td>
          <td><FieldGroup data={data} fieldName="y" onChange={onChange} /></td>
        </tr>
      </tbody>
    </Table>
  );
};

SelectedNode.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default SelectedNode;
