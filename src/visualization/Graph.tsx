import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import { DRAG_THRESHOLD } from './constants';
import { d3Node, GraphType, TreeReducerState } from '../types';
import { toHtmlCoords } from '../shared/svgHelper';
import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import popupActions from '../popups/popupActions';

import AxisManager from './AxisManager';
import TreeManager from './TreeManager';
import HotKeyManager from './HotKeyManager';

const DEBUG = true;

// testing purposes
window['d3'] = d3;

class Graph extends React.Component<any, any> {
  private margin;
  private width: number;
  private height: number;
  private svg;
  private isDragging: boolean;
  private dragBehavior: d3.DragBehavior<any, any, any>;
  private destDragNode;
  private container;

  svgPoint(element, x, y) {
    var pt = this.svg.node().createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(element.getScreenCTM().inverse());
  }

  componentDidMount() {
    // set the dimensions and margins of the graph
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};

    const margin = this.margin;
    this.width = 960 - margin.left - margin.right,
    this.height = 2400 - margin.top - margin.bottom;

    // add the svg canvas
    this.svg
      .on('click', e => {
          const d3e = d3.event;

          const t = d3e.target;
          const x = d3e.clientX;
          const y = d3e.clientY;
          // const target = (t == this.svg.node() ? this.svg.node() : t.parentNode);
          const target = this.svg.node();
          const svgP = this.svgPoint(target, x, y);
          // console.log(target);
          console.log(x);
          console.log(y);
          console.log(svgP);
          console.log('--------->');
          this.props.actions.selectGraph();
        })
        .attr('width', this.width + margin.left + margin.right)
        .attr('height', this.height + margin.top + margin.bottom);

    const self = this;
    this.dragBehavior = d3.drag()
      .on('start', d => {
        // d3.selectAll('.ghost.disabled').attr('class', 'ghost');
        d3.event.sourceEvent.stopPropagation();
      })
      .on('drag', (d) => {
        const e = d3.event;
        if (e.x - d['x']  > DRAG_THRESHOLD || e.y - d['y'] > DRAG_THRESHOLD || d['type'] === 'IMAGE') {
          self.isDragging = true;
          d3.selectAll('.ghost.disabled').attr('class', 'ghost');
        }
      })
      .on('end', d => {
        if (self.isDragging) {
          console.log('drag ended');

          d3.selectAll('.ghost').attr('class', 'ghost disabled');

          // fix this yolo code plz
          if (d['type'] == 'IMAGE') {
            this.props.actions.attachImageToNode(d['href'], self.destDragNode);
          }
          else if (self.destDragNode && d['data'].id !== self.destDragNode.data.id) {
            console.log(`moving ${d['data'].id} to ${self.destDragNode.data.id}`)
            self.props.actions.moveNode(d, self.destDragNode);
          }

          self.destDragNode = null;
        } else {
          // assume a click event
          // handled by another handler
          console.log('assume you clicked!');
        }

        self.isDragging = false;
      });
  }

  onClick(node) {
    this.props.actions.selectNode(node);
    d3.event.stopPropagation();
  }

  onTextClick(node, transform) {
    if (!node.x || !node.y) {
      console.error('node does not have coordinates!');
      return;
    }

    const htmlCoords = toHtmlCoords(node, transform);
    this.props.actions.selectNode(node);
    this.props.popupActions.showEditBox(htmlCoords);
  }

  onMouseOver(node, context) {
    if (this.isDragging) {
      this.destDragNode = node;

      d3.select(context).attr('class', 'ghost hover');
    }
  }

  onMouseOut(node, context) {
    if (this.isDragging) {
      this.destDragNode = null;
      d3.select(context).attr('class', 'ghost');
    }
  }

  _graphToReactElement(graph: TreeReducerState<string>) {
    const selectedNode = this.props.selectedEntity.node;

    if (graph.type === GraphType.Tree) {
      return <TreeManager dragBehavior={this.dragBehavior}
                          onClick={this.onClick.bind(this)}
                          onTextClick={this.onTextClick.bind(this)}
                          onMouseOver={this.onMouseOver.bind(this)}
                          onMouseOut={this.onMouseOut.bind(this)}
                          root={graph.treeRoot}
                          updateNode={graph.updateNode}
                          display={graph.display}
                          selectedNode={selectedNode}
                          dx={graph.dx}
                          dy={graph.dy}
                          dx2={graph.dx2}
                          dy2={graph.dy2} />
    }
  }

  render() {
    let graphsElements = null;
    let mainGraph = this.props.graph;
    let self = this;

    if (mainGraph.subStates && mainGraph.subStates.length > 0) {
      graphsElements = mainGraph.subStates.map(this._graphToReactElement.bind(this));
    }

    const handlers = {
      'ctrl+left': (e) => {
        console.log(e);
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

    return (
      <div>
        <AxisManager container={this.svg} dragBehavior={this.dragBehavior} />
        <HotKeyManager>
          <svg id="main" ref={(svg) => this.svg = d3.select(svg)}>
            {graphsElements}
          </svg>
        </HotKeyManager>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
