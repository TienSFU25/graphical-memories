import * as React from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap';

import { ZoomMode } from '../types';
import { PropsFromState, PropsFromActions, PropsPassedIn } from './props';

type Props = PropsFromState & PropsFromActions & PropsPassedIn
type State = {}

export default class ZoomDropdown extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
  }

  onSelect(eventKey) {
    this.props.toggleZoom(eventKey);
  }

  render(): JSX.Element {
    return (
      <NavDropdown eventKey={0} title="Zoom Mode" onSelect={this.onSelect.bind(this)} id="zoom-mode">
        <MenuItem eventKey={ZoomMode.None}>None</MenuItem>
        <MenuItem eventKey={ZoomMode.Normal}>Normal</MenuItem>
      </NavDropdown>
    );
  }
}
