import * as React from 'react';

interface Props {
  value?: string;
  className?: string;
  style?: Object;
  onChange: Function;
  id?: string;
  autoFocus?: boolean;
  placeholder?: string;
}

class InputField extends React.Component<Props, any> {
  private editInput;

  onChange(e) {
    const value = e.target.value;

    if (this.props.id) {
      this.props.onChange(this.props.id, value);
    } else {
      this.props.onChange(value);
    }
  }

  componentDidUpdate() {
    if (this.editInput && this.props.autoFocus) {
      console.log(`focusing!`);
      console.log(this.editInput);
      this.editInput.focus();
    }
  }

  render() {
    return (
      <input type="text" value={this.props.value}
                        className={this.props.className}
                        id={this.props.id}
                        onChange={this.onChange.bind(this)}
                        style={this.props.style}
                        ref={(input) => this.editInput = input}
                        placeholder={this.props.placeholder} />
    );
  }
};

export default InputField;
