import * as React from 'react';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';
import keyCodes from '../shared/keyCodes';

interface Props {
  value?: string;
  onSave: Function;
  show: boolean;
  className?: string;
  style?: Object;
  autoFocus?: boolean;
  keyHandler?: Function;
}

class InputField extends React.Component<Props, any> {
  private editInput;

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  onBlur(e) {
    this.props.onSave({
      name: this.state.value
    });

    e.stopPropagation();
  }

  onChange(e) {
    const value = e.target.value;
    this.setState({
      value
    });
  }

  onKeyDown(e) {
    if (e.which === keyCodes.ENTER) {
      this.props.onSave({
        name: this.state.value
      });

      e.stopPropagation();
    }

    if (this.props.keyHandler) {
      this.props.keyHandler(e);
    }
  }

  componentDidMount() {
    console.log('this shit mounted!');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentDidUpdate() {
    if (this.editInput && this.props.autoFocus) {
      this.editInput.focus();
    }
  }

  render() {
    let InputField = <div />;

    if (this.props.show) {
      InputField = <input type="text" className={this.props.className} value={this.state.value} style={this.props.style} ref={(input) => this.editInput = input}
              onChange={this.onChange.bind(this)}
              onKeyDown={this.onKeyDown.bind(this)}
              onBlur={this.onBlur.bind(this)} />;
    }

    return InputField;
  }
};

export default InputField;
