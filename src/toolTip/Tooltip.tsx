import * as React from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { ControlLabel, Col, Form, FormControl, FormGroup } from 'react-bootstrap';

import { ZoomMode } from '../types';
import { PropsFromState, PropsFromActions, PropsPassedIn } from './props';
import InputField from '../shared/InputField';

type Props = PropsFromState & PropsFromActions & PropsPassedIn
type State = {}

export default class Tooltip extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render(): JSX.Element {
    const className = this.props.isToolTipShown ? 'tooltip' : 'tooltip tooltip-hidden';
    const style = {
      top: this.props.y,
      left: this.props.x
    };

    const currNode = this.props.node;
    let contents = <div />;

    if (currNode && currNode.data) {
      contents = (
        <div>
          <div>id: {currNode.data.id}</div>
          <div>name: {currNode.data.name}</div>
        </div>
      );
    }

    return (
      <div className={className} style={style}>
        {contents}
      </div>
    );
  }
}
