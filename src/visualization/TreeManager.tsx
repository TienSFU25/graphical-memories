import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { d3Node } from '../types';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';

require('./styles.scss');

const DEBUG = true;

// testing purposes
window['d3'] = d3;

interface ITreeManagerProps {
  dragBehavior: d3.DragBehavior<any, any, any>,
  onClick,
  onTextClick,
  onMouseOver,
  onMouseOut,
  onDelayedHover,
  container,
  root,
  updateNode
}

class TreeManager extends React.Component<ITreeManagerProps, any> {
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
      updateNode: this.props.updateNode
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      root: nextProps.root,
      updateNode: nextProps.updateNode
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

  update(source) {
    const self = this;
    const context = this.state.g;
    const root = this.state.root;

    const DELAY = 500;
    const t = d3.transition('myT').duration(750);

    function attachBehaviors() {
      let timeout = null;
      const node = d3.select(this);
      const nodeData = this;
      const text = node.select('text');
      const circle = node.select('circle');

      // setup drag and click behaviors
      circle.call(self.props.dragBehavior);

      // circle.on('click', (thisNode) => {
      //   self.props.onClick(thisNode);
      //   d3.event.stopPropagation();
      // }).on('dblclick', thisNode =>
      // {
      //   self._toggle(thisNode);
      //   self.update(thisNode);
      //   d3.event.stopPropagation();
      // });

      // delayed hover
      circle.on('mouseover', (thisNode) => {
        timeout = setTimeout(_ => {
          self.props.onDelayedHover(thisNode);
        }, DELAY);
      }).on('mouseout',() => {
        clearTimeout(timeout);
      });

      text.on('click', (thisNode) => {
        self.props.onTextClick(thisNode);
        d3.event.stopPropagation();
      });
    }

    const nodes = context.selectAll('.node')
      .data(root.descendants(), d => d.data.id);

    nodes.transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1')
      .on('end', attachBehaviors);

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
      .attr('r', 7.5);

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
          .attr('x', d => d['children'] ? -8 : 8)
          .attr('class', d => d['children'] ? 'internal': 'leaf')
          .text(_ => {
            return node.data.name;
          });
      });

    // stick in DOM
    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { i++; const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1')
      .on('end', attachBehaviors);

    console.log(`updating ${i} nodes`);

    const exitNodes = nodes.exit()
      .transition(t)
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    const links = context.selectAll('.link')
      .data(root.descendants().slice(1), d => d.data.id);

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
}

export default TreeManager;
