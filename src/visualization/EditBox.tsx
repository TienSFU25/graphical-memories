import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

interface Coordinates {
  x: number;
  y: number;
}

interface Props {
  value?: string;
  htmlCoords: Coordinates;
  show: boolean;
  onSave: Function;
  actions: any;
}

class EditBox extends React.Component<Props, any> {
  private ref;

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  onChange(e) {
    const value = e.target.value;
    this.setState({
      value
    });

    this.props.actions.updateEditValue(value);
  }

  onKeyDown(e) {
    if (e.which === 13) {
      this.props.onSave(this.state.value);
      e.stopPropagation();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }

    if (nextProps.show) {
      this.ref.focus();
    }
  }

  render() {
    const style = {
      top: this.props.htmlCoords.y + window.pageYOffset,
      left: this.props.htmlCoords.x
    };

    const className = this.props.show ? 'editBox' : 'editBox hide';

    return (
      <input type="text" className={className} value={this.state.value} style={style} ref={(input) => this.ref = input}
        onChange={this.onChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)} />
    );
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(() => { return {}}, mapDispatchToProps)(EditBox);
