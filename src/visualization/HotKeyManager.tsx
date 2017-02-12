import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import { findSibling } from './treeManipulator';

interface Props {
  selectedNode: any;
  handler: Function;
}

interface PropsFromActions {
  popupActions: any;
  graph: any;
}

class HotKeyManager extends React.Component<Props & PropsFromActions, any> {
  private _handlerInstance;
  private hotKeyWrapper;

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;
    const propsHandler = this.props.handler;

    // code reuse
    const getInfo = () => {
      // return [ self.props.selectedEntity.node, self.props.editBox.show ];
    };

    const showIfAlreadyVisible = (editBoxShow, nodeToMove) => {
      if (editBoxShow) {
        self.props.popupActions.showEditBox(nodeToMove);
      }
    };

    const handlers = {
      'ctrl+left': (e) => {
        // select ancestor
        e.preventDefault();

        // const [ selectedNode, editBoxShow ] = getInfo();
        const selectedNode = self.props.selectedNode;

        if (selectedNode && selectedNode.parent) {
          propsHandler(selectedNode.parent);
          // self.props.actions.selectNode(selectedNode.parent);
          // showIfAlreadyVisible(editBoxShow, selectedNode.parent);
        }
      },
      'ctrl+right': (e) => {
        // select first descendant
        e.preventDefault();

        // const [ selectedNode, editBoxShow ] = getInfo();
        const selectedNode = self.props.selectedNode;

        if (selectedNode && selectedNode.children) {
          propsHandler(selectedNode.children[0]);
          // self.props.actions.selectNode(selectedNode.children[0]);
          // showIfAlreadyVisible(editBoxShow, selectedNode.children[0]);
        }
      },
      'ctrl+up': (e) => {
        // first "younger" sibling
        e.preventDefault();
        const selectedNode = self.props.selectedNode;
        // const [ selectedNode, editBoxShow ] = getInfo();

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          propsHandler(sibling);
          // self.props.actions.selectNode(sibling);
          // showIfAlreadyVisible(editBoxShow, sibling);
        }
      },
      'ctrl+down': (e) => {
        // first "older" sibling
        e.preventDefault();

        // const [ selectedNode, editBoxShow ] = getInfo();
        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          propsHandler(sibling);
          // self.props.actions.selectNode(sibling);
          // showIfAlreadyVisible(editBoxShow, sibling);
        }
      },
      'tab': (e) => {
        // first "older" sibling
        e.preventDefault();

        // const [ selectedNode, editBoxShow ] = getInfo();
        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          propsHandler(sibling);
          // self.props.actions.selectNode(sibling);
          // showIfAlreadyVisible(editBoxShow, sibling);
        }
      },
      'shift+tab': (e) => {
        // first "younger" sibling
        e.preventDefault();

        // const [ selectedNode, editBoxShow ] = getInfo();
        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          propsHandler(sibling);
          // self.props.actions.selectNode(sibling);
          // showIfAlreadyVisible(editBoxShow, sibling);
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
    // selectedEntity,
    // editBox,
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
