import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import { findSibling } from './treeManipulator';

class HotKeyManager extends React.Component<any, any> {
  private _handlerInstance;
  private hotKeyWrapper;

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;

    const handlers = {
      'ctrl+left': (e) => {
        console.log('ctrl left');
        // select ancestor
        const selectedNode = self.props.selectedEntity.node;

        if (selectedNode && selectedNode.parent) {
          self.props.actions.selectNode(selectedNode.parent);
          self.hotKeyWrapper.focus();
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
      <HotKeys handlers={this.getHandlerInstance()}>
        <div ref={(wrapper) => this.hotKeyWrapper = wrapper }>
          {this.props.children}
        </div>
      </HotKeys>
    );
  }
};


function mapStateToProps({ selectedEntity, editBox, graph }) {
  return {
    selectedEntity,
    editBox,
    graph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HotKeyManager);
