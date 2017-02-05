import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { findSibling } from './treeManipulator';

class HotKeyManager extends React.Component<any, any> {
  private _handlerInstance;

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;

    const handlers = {
      'ctrl+left': (e) => {
        // select ancestor
        const selectedNode = self.props.selectedEntity.node;

        if (selectedNode && selectedNode.parent) {
          self.props.actions.selectNode(selectedNode.parent);
        }
      },
      'ctrl+right': () => {
        // select first descendant
        const selectedNode = self.props.selectedEntity.node;

        if (selectedNode && selectedNode.children) {
          self.props.actions.selectNode(selectedNode.children[0]);
        }
      },
      'ctrl+up': () => {
        // first "younger" sibling
        const selectedNode = self.props.selectedEntity.node;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          self.props.actions.selectNode(sibling);
        }
      },
      'ctrl+down': () => {
        // first "older" sibling
        const selectedNode = self.props.selectedEntity.node;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          self.props.actions.selectNode(sibling);
        }
      }
    };

    this._handlerInstance = handlers;
    return handlers;
  }

  render() {
    return (
      <HotKeys handlers={this.getHandlerInstance.bind(this)} >
        {this.props.children}
      </HotKeys>
    );
  }
};


function mapStateToProps({ selectedEntity, editBox, graph }) {
  return {
    selectedEntity,
    graph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HotKeyManager);
