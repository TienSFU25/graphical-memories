import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-bootstrap';
import { bindActionCreators } from 'redux';

import { DRAG_THRESHOLD } from './constants';
import { d3Node, GraphType, TreeReducerState, TreeType } from '../types';
import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { tooltipActions } from '../tooltip';
import { popupActions } from '../popups';

import Carousel from '../carousel';
import CircularNodeTree from './CircularNodeTree';
import RectangularNodeTree from './RectangularNodeTree';
import LinkAsNodeTree from './LinkAsNodeTree';
import ViewWrapper from './ViewWrapper';
import QuickKeys from '../QuickKeys';
import SelectedEntity from '../graphMetadata/SelectedEntity';

// testing purposes
window['d3'] = d3;

class Graph extends React.Component<any, any> {
  private isDragging: boolean;
  private dragBehavior: d3.DragBehavior<any, any, any>;
  private destDragNode;
  private wrapper;
  private previousDisplay;

  componentDidMount() {
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

  onNodeClick(node) {
    this.props.actions.toggleNode(node);
  }

  onRectClick() {
    this.props.actions.selectGraph();
  }

  onTextClick(node) {
    if (!node.x || !node.y) {
      console.error('node does not have coordinates!');
      return;
    }

    this.props.actions.selectNode(node);
  }

  onMouseOver(node, context) {
    this.props.tooltipActions.showTooltip(node);

    // if (this.isDragging) {
    //   this.destDragNode = node;

    //   d3.select(context).attr('class', 'ghost hover');
    // }
  }

  onMouseOut(node, context) {
    this.props.tooltipActions.hideTooltip();

    // if (this.isDragging) {
    //   this.destDragNode = null;
    //   d3.select(context).attr('class', 'ghost');
    // }
  }

  _graphStateToReactElement(graph: TreeReducerState<string>) {
    const selectedNode = this.props.selectedEntity.node;

    if (graph.type === GraphType.Tree) {
      let Wrapped;
      Wrapped = this.wrapper;

      if (!Wrapped || this.previousDisplay == undefined || this.previousDisplay !== graph.display) {
        // cache Wrapped HOC or React will rerender everything
        if (graph.display === TreeType.Collapsible) {
          Wrapped = ViewWrapper(RectangularNodeTree);
        } else if (graph.display === TreeType.LinkText) {
          Wrapped = ViewWrapper(LinkAsNodeTree);
        } else {
          Wrapped = ViewWrapper(CircularNodeTree);
        }

        this.wrapper = Wrapped;
        this.previousDisplay = graph.display;
      }

      return <Wrapped dragBehavior={this.dragBehavior}
                      onNodeClick={this.onNodeClick.bind(this)}
                      onRectClick={this.onRectClick.bind(this)}
                      onTextClick={this.onTextClick.bind(this)}
                      onMouseOver={this.onMouseOver.bind(this)}
                      onMouseOut={this.onMouseOut.bind(this)}
                      selectedNode={selectedNode}
                      graph={graph}
                      zoomEnabled={this.props.zoomEnabled}
                      key={`graph-${graph.treeRoot.data.id}`} />;
    }
  }

  handleHotKey(node) {
    this.props.actions.selectNode(node);
  }

  render() {
    let GraphElement = null;
    let mainGraph = this.props.graph;

    if (mainGraph.graphState) {
      GraphElement = this._graphStateToReactElement(mainGraph.graphState);
    }

    return (
      <Row>
        <Col xs={2}>
          <Carousel dragBehavior={this.dragBehavior} />
        </Col>
        <Col xs={7}>
          <QuickKeys selectedNode={this.props.selectedEntity.node} handler={this.handleHotKey.bind(this)}>
            {GraphElement}
          </QuickKeys>
        </Col>
        <Col xs={3}>
          <SelectedEntity />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps({ selectedEntity, graph, zoomEnabled }) {
  return {
    selectedEntity,
    graph,
    zoomEnabled
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch),
    popupActions: bindActionCreators(popupActions, dispatch),
    tooltipActions: bindActionCreators(tooltipActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
