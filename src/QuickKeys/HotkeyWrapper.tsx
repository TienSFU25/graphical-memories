import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';
import { findSibling } from '../visualization/treeManipulator';

import { PropsFromState, PropsFromActions, PropsPassedIn } from './props'

type Props = PropsFromState & PropsFromActions & PropsPassedIn;
type State = {};

export default class HotkeyWrapper extends React.Component<Props, any> {
  private _handlerInstance;
  private hotKeyWrapper;

  getHandlerInstance() {
    if (this._handlerInstance) return this._handlerInstance;

    const self = this;
    const propsHandler = this.props.handler;

    const handlers = {
      'ctrl+left': (e) => {
        // select ancestor
        e.preventDefault();

        const selectedNode = self.props.selectedNode;

        if (selectedNode && selectedNode.parent) {
          propsHandler(selectedNode.parent);
        }
      },
      'ctrl+right': (e) => {
        // select first descendant
        e.preventDefault();

        const selectedNode = self.props.selectedNode;

        if (selectedNode && selectedNode.children) {
          propsHandler(selectedNode.children[0]);
        }
      },
      'ctrl+up': (e) => {
        // first "younger" sibling
        e.preventDefault();
        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          propsHandler(sibling);
        }
      },
      'ctrl+down': (e) => {
        // first "older" sibling
        e.preventDefault();

        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          propsHandler(sibling);
        }
      },
      'tab': (e) => {
        // first "older" sibling
        e.preventDefault();

        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates, false);
          propsHandler(sibling);
        }
      },
      'shift+tab': (e) => {
        // first "younger" sibling
        e.preventDefault();

        const selectedNode = self.props.selectedNode;

        if (selectedNode) {
          const sibling = findSibling(selectedNode, self.props.graph.subStates);
          propsHandler(sibling);
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
