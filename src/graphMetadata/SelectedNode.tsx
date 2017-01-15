import * as d3 from 'd3';
import * as React from 'react';
import * as _ from 'lodash';
import { ControlLabel, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';

interface ISelectedNodeProps {
  data: d3Node,
  onChange: Function
}

export default class SelectedNode extends React.Component<ISelectedNodeProps, any> {
  _toDataRow(key, value, readOnly = false) {
    return (
      <tr>
        <td>
          <FormGroup controlId={value}>
            <ControlLabel>{key}</ControlLabel>
          </FormGroup>
        </td>
        <td>
          <input type="text" id={`edit-${value}`} readOnly={readOnly} value={value}/>
        </td>
      </tr>
    );
  }

  render() {
    const { data, onChange } = this.props;
    const self = this;

    const readOnlyProps = Object.assign({}, this.props.data);
    const writeProps = Object.assign({}, this.props.data.data);

    const noTouchie = ['data', 'parent', 'children'];
    const validReadKeys = _.filter(Object.keys(readOnlyProps), (prop) => {
      return _.indexOf(noTouchie, prop) === -1;
    });

    const allRows = [];
    for (let validKey of validReadKeys) {
      allRows.push(this._toDataRow(validKey, readOnlyProps[validKey], true));
    }

    const validWriteKeys = ['id', 'name'];
    for (let validKey of validWriteKeys) {
      allRows.push(this._toDataRow(validKey, writeProps[validKey]));
    }

    return (
      <Table striped bordered condensed hover id="meta">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {allRows}
        </tbody>
      </Table>
    );
  }
};
