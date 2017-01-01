import * as React from 'react';
import {PropTypes} from 'react';
import {Table} from 'react-bootstrap';

const SelectedNode = ({data}) => {
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
          <td>{data.id}</td>
        </tr>
        <tr>
          <td>label</td>
          <td>{data.label}</td>
        </tr>
        <tr>
          <td>x</td>
          <td>{data.x}</td>
        </tr>
        <tr>
          <td>y</td>
          <td>{data.y}</td>
        </tr>
      </tbody>
    </Table>
  );
};

// SelectedNode.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default SelectedNode;
