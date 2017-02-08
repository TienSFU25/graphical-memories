import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import { findSibling } from './treeManipulator';
import { toHtmlCoords } from '../shared/svgHelper';

class HotKeyManager extends React.Component<any, any> {
  private _handlerInstance;
  private hotKeyWrapper;

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;

    // code reuse
    const getInfo = () => {
      return [ self.props.selectedEntity.node, self.props.editBox.show ];
    };

    const showIfAlreadyVisible = (editBoxShow, nodeToMove) => {
      if (editBoxShow) {
        const htmlCoords = toHtmlCoords(nodeToMove);
        self.props.popupActions.showEditBox(htmlCoords);
      }
    };

    const handlers = {
      'ctrl+left': (e) => {
        // select ancestor
        const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode && selectedNode.parent) {
          self.props.actions.selectNode(selectedNode.parent);
          showIfAlreadyVisible(editBoxShow, selectedNode.parent);
          e.preventDefault();
        }
      },
      'ctrl+right': (e) => {
        // select first descendant
        const [ selectedNode, editBoxShow ] = getInfo();


        if (selectedNode && selectedNode.children) {
          self.props.actions.selectNode(selectedNode.children[0]);
          showIfAlreadyVisible(editBoxShow, selectedNode.children[0]);
          e.preventDefault();
        }
      },
      'ctrl+up': (e) => {
        // first "younger" sibling
        const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          self.props.actions.selectNode(sibling);
          showIfAlreadyVisible(editBoxShow, sibling);
          e.preventDefault();
        }
      },
      'ctrl+down': (e) => {
        // first "older" sibling
        const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          self.props.actions.selectNode(sibling);
          showIfAlreadyVisible(editBoxShow, sibling);
          e.preventDefault();
        }
      },
      'tab': (e) => {
        // first "older" sibling
        const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          self.props.actions.selectNode(sibling);
          // showIfAlreadyVisible(editBoxShow, sibling);
          e.preventDefault();
        }
      },
      'shift+tab': (e) => {
        // first "younger" sibling
        const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          self.props.actions.selectNode(sibling);
          showIfAlreadyVisible(editBoxShow, sibling);
          e.preventDefault();
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
