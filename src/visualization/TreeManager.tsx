import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';

require('./styles.scss');

const DEBUG = true;

// testing purposes
window['d3'] = d3;

class TreeManager extends React.Component<any, any> {
  private margin;
  private width: number;
  private height: number;
  private svg;
  private g;
  private root: d3.HierarchyNode<any>;
  private isDragging: boolean;
  private dragger: d3.DragBehavior<any, any, any>;
  private destDragNode;

  constructor(props) {
    super(props);
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
        console.log(target);
        console.log(svgP);
        this.props.actions.selectGraph;
      })
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);

    this.g = this.svg.append('g');
  }

  componentWillReceiveProps(nextProps) {
    console.log('setting data on tree...');
    let treeRoot = nextProps.graph.treeRoot;
    this.root = treeRoot;
    this.update(treeRoot);
  }

  render() {
    return (
      <div>
        <div id="chart"></div>
      </div>
    );
  }

  svgPoint(element, x, y) {
    var pt = this.svg.node().createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(element.getScreenCTM().inverse());
  }

  update(source) {
    const self = this;
    this.dragger = d3.drag()
      .on('start', d => {
        self.isDragging = true;
        d3.selectAll('.ghost.disabled').attr('class', 'ghost');
        d3.event.sourceEvent.stopPropagation();
      })
      .on('end', d => {
        self.isDragging = false;
        d3.selectAll('.ghost').attr('class', 'ghost disabled');

        if (self.destDragNode) {
          self.props.actions.moveNode(d, self.destDragNode);
          self.destDragNode = null;
        }
      });

    const t = d3.transition('myT').duration(750);

    const nodes = this.g.selectAll('.node')
      .call(this.dragger)
      .data(source.descendants(), d => d.data.name);

    nodes.transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    const enterNodes = nodes.enter().append('g');

    let i = 0;

    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { console.log(i++); const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    enterNodes.append('circle')
      .attr('r', 10)
      .attr('class', 'ghost disabled')
      .on('mouseover', function(d) {
        if (self.isDragging) {
          self.destDragNode = d;

          d3.select(this)
            .attr('class', 'ghost hover');
        }
      })
      .on('mouseout', function(d) {
        if (self.isDragging) {
          self.destDragNode = null;
          d3.select(this)
            .attr('class', 'ghost');
        }
      });

    enterNodes.append('circle')
      .attr('r', 7.5)
      .on('click', thisNode => {
        this.props.actions.selectNode(thisNode);
        d3.event.stopPropagation();
      })
      .on('dblclick', thisNode =>
      {
        console.log('click event actually registered');
        this._toggle(thisNode);
        this.update(this.root);
        d3.event.stopPropagation();
      });

    // refresh the text
    nodes.selectAll('text').remove();
    enterNodes.merge(nodes)
      .append('text')
      .attr('dy', 3)
      .attr('x', d => d['children'] ? -8 : 8)
      .attr('class', d => d['children'] ? 'internal': 'leaf')
      .text(node => {
        if (DEBUG) {
          // base += `:\\${node.height}\\${node.depth}\\${this._isDefined(node.children) ? node.children.length : -1}\\${this._isDefined(node['_children']) ? node['_children'].length : -1}`;
        }

        return node.data.name;
      });

    const exitNodes = nodes.exit()
      .transition(t)
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    const links = this.g.selectAll('.link')
      .data(source.descendants().slice(1), d => d.data.name);

    const enterLinks = links.enter()
      .append('path')
      .attr('d', d => {
        return `M${source['y']},${source['x']}`
          + `C${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
      })
      .merge(links)
      .transition(t)
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d['y']},${d['x']}`
          + `C${d['parent']['y'] + 100},${d['x']}`
          + ` ${d['parent']['y'] + 100},${d['parent']['x']}`
          + ` ${d['parent']['y']},${d['parent']['x']}`
      });

    const exitLinks = links.exit()
      .transition(t)
      .attr('d', d => {
        return `M${source['y']},${source['x']}`
          + `C${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
      })
      .remove();
  }

  _toggle(node) {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null
    }
  }
}

function mapStateToProps({ graph }) {
  return {
    graph
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(graphManipulationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeManager);
