import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { d3Node, TreeType } from '../types';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';

import '../css/styles.scss';

const DEBUG = true;

// testing purposes
window['d3'] = d3;

interface ITreeManagerProps {
  dragBehavior: d3.DragBehavior<any, any, any>;
  onClick: Function;
  onTextClick: Function;
  onMouseOver: Function;
  onMouseOut: Function;
  container;
  root;
  updateNode;
  selectedNode;
  display;
}

class TreeManager extends React.Component<ITreeManagerProps, any> {
  private DOMSelectedNode;

  constructor(props) {
    super(props);

    this.state = {
      g: null,
      root: null,
      updateNode: null
    };
  }

  // thank you redux
  shouldComponentUpdate(nextState) {
    return (nextState.updateNode !== this.state.updateNode);
  }

  componentDidMount() {
    this.setState({
      g: this.props.container.append('g'),
      root: this.props.root,
      updateNode: this.props.updateNode,
      display: this.props.display
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedNode) {
      this.updateSelectedNode(nextProps.selectedNode);
    } else if (this.DOMSelectedNode) {
      this.clearSelectedNode();
    }

    this.setState({
      root: nextProps.root,
      updateNode: nextProps.updateNode,
      display: this.props.display
    });
  }

  render() {
    if (this.state.updateNode) {
      this.update(this.state.updateNode);
    }

    return (
      <div />
    );
  }

  clearSelectedNode() {
    this.DOMSelectedNode.attr('class', 'inner');
  }

  updateSelectedNode(selectedNode) {
    const context = this.state.g;
    const root = this.state.root;
    const self = this;

    const nodes = context.selectAll('.node')
      .data(root.descendants(), d => d.data.id);

    // update selected node
    nodes.selectAll('circle.inner')
      .attr('class', function(d: d3Node) {
        let className = 'inner';

        if (selectedNode && d.data.id == selectedNode.data.id) {
          // save node to deselect when updating
          self.DOMSelectedNode = d3.select(this);
          className += ' selected';
        }

        return `${className}`;
      });
  }

  update(source: d3Node) {
    const self = this;
    const context = this.state.g;
    const root = this.state.root;

    const DELAY = 500;
    const t = d3.transition('myT').duration(750);

    // function project(x, y) {
    //   var angle = (x - 90) / 180 * Math.PI, radius = y;
    //   return [radius * Math.cos(angle), radius * Math.sin(angle)];
    // }

    function attachBehaviors() {
      const node = d3.select(this);
      const nodeData = this;
      const text = node.select('text');
      const circle = node.select('circle');

      // setup drag and click behaviors
      circle.call(self.props.dragBehavior);

      text.on('click', (thisNode) => {
        self.props.onTextClick(thisNode);
        d3.event.stopPropagation();
      });
    }

    const nodes = context.selectAll('.node')
      .data(root.descendants(), d => d.data.id);

    // update text or image if node
    // IS THERE A BETTER WAY TO DO THESE UPDATES???
    nodes.each(function(node) {
      const nodeContainer = d3.select(this);
      const newNodeName = node.data.name;
      const newImgHref = node.data.image;

      nodeContainer.select('text').text(newNodeName);
      nodeContainer.select('image').attr('href', newImgHref);
    });

    const enterNodes = nodes.enter().append('g');
    let i = 0;

    enterNodes.append('circle')
      .attr('r', 7.5)
      .attr('class', 'inner');

    enterNodes.append('circle')
      .attr('r', 20)
      .attr('class', 'ghost disabled')
      .attr('pointer-events', 'mouseover')
      .on('mouseover', function(node) {
        self.props.onMouseOver(node, this);
      })
      .on('mouseout', function(node) {
        self.props.onMouseOut(node, this);
      });

    enterNodes
      .each(function(node) {
        const nodeContainer = d3.select(this);

        if (node.data.image) {
          nodeContainer.append('image')
            .attr('href', node.data.image)
            .attr('width', IMAGE_WIDTH)
            .attr('height', IMAGE_HEIGHT)
            .attr('x', IMAGE_WIDTH * -0.5)
            .attr('y', IMAGE_HEIGHT * -0.5);

          // remove the circle
          nodeContainer.select('circle').remove();
        }

        nodeContainer.append('text')
          .attr('dy', 3)
          .attr('x', (d: d3Node) => d.children ? -8 : 8)
          .attr('class', (d: d3Node) => d.children ? 'internal': 'leaf')
          .text(_ => {
            return node.data.name;
          });
      });

    function project(x, y, dx, dy) {
      var angle = (x - 90) / 180 * Math.PI, radius = y;
      return [radius * Math.cos(angle) + dx, radius * Math.sin(angle) + dy];
    }

    // stick in DOM
    const transform = `translate(${source.y}, ${source.x})`;
    let nodeTransform;
    let linkTransform;

    if (this.state.display === TreeType.VerticalTree) {
      nodeTransform = (d: d3Node) => `translate(${d.y}, ${d.x})`
      linkTransform = (d: d3Node) => {
        return `M${d.y},${d.x}`
          + `C${d.parent.y + 100},${d.x}`
          + ` ${d.parent.y + 100},${d.parent.x}`
          + ` ${d.parent.y},${d.parent.x}`;
      };
    } else if (this.state.display === TreeType.Radial) {
      nodeTransform = (d: d3Node) => `translate(${d.x + d.dx}, ${d.y + d.dy})`
      linkTransform = (d: d3Node) => {
        return "M" + project(d.x0, d.y0, d.dx, d.dy)
            + "C" + project(d.x0, (d.y0 + d.parent.y0) / 2, d.dx, d.dy)
            + " " + project(d.parent.x0, (d.y0 + d.parent.y0) / 2, d.dx, d.dy)
            + " " + project(d.parent.x0, d.parent.y0, d.dx, d.dy);
      };
    } else {
      console.log('wtf display??');
    }
    // const nodeTransform = (d: d3Node) => `translate(${project(d.x, d.y)})`;

    enterNodes
      .attr('transform', transform )
      .attr('style', 'fill-opacity: 1e-6')
      .merge(nodes)
      .transition(t)
      .attr('class', (d:d3Node) => {
        i++;

        const className = d.children ? 'internal': 'leaf';
        return `node ${className}`;
      })
      .attr('transform', nodeTransform)
      .attr('style', 'fill-opacity: 1')
      .on('end', attachBehaviors);

    console.log(`updating ${i} nodes`);

    const exitNodes = nodes.exit()
      .transition(t)
      .attr('transform', `translate(${source.y}, ${source.x})` )
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    const links = context.selectAll('.link')
      .data(root.descendants().slice(1), d => d.data.id);

    const enterLinks = links.enter()
      .append('path')
      .attr('d', (d: d3Node) => {
          return `M${source.y},${source.x}`
            + `C${source.y},${source.x}`
            + ` ${source.y},${source.x}`
            + ` ${source.y},${source.x}`
      })
      .merge(links)
      .transition(t)
      .attr('class', 'link')
      .attr('d', linkTransform);

    const exitLinks = links.exit()
      .transition(t)
      .attr('d', d => {
        return `M${source.y},${source.x}`
          + `C${source.y},${source.x}`
          + ` ${source.y},${source.x}`
          + ` ${source.y},${source.x}`
      })
      .remove();
  }
}

export default TreeManager;
