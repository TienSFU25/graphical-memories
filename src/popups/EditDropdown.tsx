import * as React from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap';

import { EditMode } from '../types';
import { PropsFromState, PropsFromActions, PropsPassedIn } from './props';

type Props = PropsFromState & PropsFromActions & PropsPassedIn
type State = {}

export default class EditDropdown extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
  }

  onEditChange(eventKey) {
    this.props.toggleEdit(eventKey);
  }

  render(): JSX.Element {
    return (
      <NavDropdown eventKey={0} title="Edit Mode" onSelect={this.onEditChange.bind(this)} id="edit-mode">
        <MenuItem eventKey={EditMode.Standard}>Standard</MenuItem>
        <MenuItem eventKey={EditMode.Quick}>Quick</MenuItem>
      </NavDropdown>
    );
  }
}
