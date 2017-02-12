import * as React from 'react';

import InputField from '../shared/InputField';
import QuickKeys from '../QuickKeys';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props';

type Props = PropsFromState & PropsFromActions & PropsPassedIn;
type State = {
  editValue: string
};

export default class InputWrapper extends React.Component<Props, State> {
  private _handlerInstance;

  constructor(props) {
    super(props);

    this.state = {
      editValue: ''
    };
  }

  onChange(id, value) {
    this.setState({
      editValue: value
    });
  }

  saveCurrentNode() {
    // save current node if any. also hides the box
    const prevNode = this.props.selectedNode;

    if (prevNode.data.name !== this.state.editValue) {
      this.props.editNode(prevNode, { name: this.state.editValue });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedNode) {
      this.setState({
        editValue: nextProps.selectedNode.data.name
      });
    }
  }

  handleHotKeys(node) {
    const currNode = this.props.selectedNode;

    // autosave
    if (currNode && currNode !== node) {
      this.saveCurrentNode();
    }

    this.props.selectNode(node);
  }

  render() {
    const { shouldShowEditBox, htmlCoords, selectedNode } = this.props;

    let inputStyle = { visibility: 'hidden', top: 0, left: 0 };

    if (shouldShowEditBox) {
      inputStyle.top = htmlCoords.y + window.pageYOffset;
      inputStyle.left = htmlCoords.x;
      inputStyle.visibility = 'visible';
    }

    return (
      <div className='edit box' style={inputStyle}>
        <QuickKeys selectedNode={selectedNode} handler={this.handleHotKeys.bind(this)}>
          <InputField autoFocus value={this.state.editValue} id='edit' onChange={this.onChange.bind(this)} />
        </QuickKeys>
      </div>
    );
  }
}
