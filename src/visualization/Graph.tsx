import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import { GraphType } from '../types';
import graphManipulationActions from '../graphMetadata/graphManipulationActions';

import AxisManager from './AxisManager';
import TreeManager from './TreeManager';

require('./styles.scss');

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

  constructor(props) {
    super(props);

    this.state = {
      graphs: []
    };
  }

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
    this.svg = d3.select('#chart')
      .append('svg')
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
        this.props.actions.selectGraph;
      })
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);

    const self = this;
    this.dragBehavior = d3.drag()
      .on('start', d => {
        self.isDragging = true;
        d3.selectAll('.ghost.disabled').attr('class', 'ghost');
        d3.event.sourceEvent.stopPropagation();
      })
      .on('end', d => {
        self.isDragging = false;
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
      });

    window['draggy'] = this.dragBehavior;
  }

  componentWillReceiveProps(nextProps) {
    console.log('graph getting some prop action...');
    const graphs = nextProps.graph.subStates;

    this.setState({
      graphs
    });
  }

  onClick(node) {
    this.props.actions.selectNode(node);
    d3.event.stopPropagation();
  }

  _toHtmlCoords(svgCoords) {
    const ctm = this.svg.node().getScreenCTM();
    const pt = this.svg.node().createSVGPoint();
    pt.x = svgCoords.y;
    pt.y = svgCoords.x;

    return pt.matrixTransform(ctm);
  }

  onTextClick(node) {
    if (!node.x || !node.y) {
      console.error('node does not have coordinates!');
      return;
    }

    const htmlCoords = this._toHtmlCoords(node);
    this.props.actions.selectNode(node);
    this.props.actions.showEditBox(htmlCoords);
  }

  onDelayedHover(node) {
    if (!node.x || !node.y) {
      console.error('node does not have coordinates!');
      return;
    }

    const htmlCoords = this._toHtmlCoords(node);
    this.props.actions.selectNode(node);
    this.props.actions.showPopup(htmlCoords);
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

  _graphToReactElement(graph) {
    if (graph.type === GraphType.Tree) {
      return <TreeManager dragBehavior={this.dragBehavior}
                          onClick={this.onClick.bind(this)}
                          onTextClick={this.onTextClick.bind(this)}
                          onMouseOver={this.onMouseOver.bind(this)}
                          onMouseOut={this.onMouseOut.bind(this)}
                          onDelayedHover={this.onDelayedHover.bind(this)}
                          container={this.svg}
                          root={graph.treeRoot}
                          updateNode={graph.updateNode}/>
    }
  }

  render() {
    let graphsElements = null;

    if (this.state.graphs && this.state.graphs.length > 0) {
      graphsElements = this.state.graphs.map(this._graphToReactElement.bind(this));
    }

    return (
      <div>
        <AxisManager container={this.svg} dragBehavior={this.dragBehavior} />
        <div id="chart">
          {graphsElements}
        </div>
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
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
