import * as React from 'react';
import { ControlLabel, Col, Row, Form, FormControl, FormGroup, Table } from 'react-bootstrap';

import { d3Node } from '../types';

interface Props {
  value?: string;
  onSave: Function;
  show: boolean;
  className: string;
  style: Object;
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
    if (e.which === 13) {
      this.props.onSave({
        name: this.state.value
      });

      e.stopPropagation();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentDidUpdate() {
    if (this.editInput) {
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
