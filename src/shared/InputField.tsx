import * as React from 'react';

interface Props {
  value?: string;
  className?: string;
  style?: Object;
  onChange: Function;
  id: string;
  autoFocus?: boolean;
}

class InputField extends React.Component<Props, any> {
  private editInput;

  onChange(e) {
    const value = e.target.value;
    this.props.onChange(this.props.id, value);
  }

  componentDidUpdate() {
    if (this.editInput && this.props.autoFocus) {
      this.editInput.focus();
    }
  }

  render() {
    let InputField = <input type="text" value={this.props.value} className={this.props.className} id={this.props.id} onChange={this.onChange.bind(this)} style={this.props.style} ref={(input) => this.editInput = input} />;

    return InputField;
  }
};

export default InputField;
