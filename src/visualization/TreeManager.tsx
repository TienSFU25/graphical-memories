import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';

require('./styles.scss');

const DEBUG = true;

// testing purposes
window['d3'] = d3;

interface ITreeManagerProps {
  dragBehavior: d3.DragBehavior<any, any, any>,
  onClick,
  onMouseOver,
  onMouseOut,
  container,
  root
}

class TreeManager extends React.Component<ITreeManagerProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      g: null,
      root: null
    };
  }

  // thank you redux
  shouldComponentUpdate(nextState) {
    return (nextState.root !== this.state.root);
  }

  componentDidMount() {
    this.setState({
      g: this.props.container.append('g'),
      root: this.props.root
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      root: nextProps.root
    });
  }

  render() {
    if (this.state.root) {
      this.update(this.state.root);
    }

    return (
      <div />
    );
  }

  update(source) {
    const self = this;
    const context = this.state.g;
    const root = this.state.root;

    const t = d3.transition('myT').duration(750);

    const nodes = context.selectAll('.node')
      .data(root.descendants(), d => d.data.id);

    nodes.transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1')
      .on('end', function(node) {
        d3.select(this).call(self.props.dragBehavior);
      });

    const enterNodes = nodes.enter().append('g');

    let i = 0;

    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { i++; const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1')
      .on('end', function() {
        const node = d3.select(this);

        // setup drag and click behaviors
        node.call(self.props.dragBehavior);
        node.on('click', (thisNode) => {
          self.props.onClick(thisNode);
          d3.event.stopPropagation();
        })
        .on('dblclick', thisNode =>
        {
          self._toggle(thisNode);
          self.update(thisNode);
          d3.event.stopPropagation();
        });
      });

    console.log(`updating ${i} nodes`);

    enterNodes.append('circle')
      .attr('r', 7.5);

    enterNodes.append('circle')
      .attr('r', 10)
      .attr('class', 'ghost disabled')
      .attr('pointer-events', 'mouseover')
      .on('mouseover', function(node) {
        self.props.onMouseOver(node, this);
      })
      .on('mouseout', function(node) {
        self.props.onMouseOut(node, this);
      });

    // refresh the text
    nodes.selectAll('text').remove();
    enterNodes.merge(nodes)
      .each(function(node) {
        const nodeContainer = d3.select(this);

        if (node.data.image) {
          nodeContainer.append('image')
            .attr('href', node.data.image)
            .attr('width', IMAGE_WIDTH)
            .attr('height', IMAGE_HEIGHT)
            .attr('x', IMAGE_WIDTH * -0.5)
            .attr('y', IMAGE_HEIGHT * -0.5);
        } else {
          nodeContainer.append('text')
            .attr('dy', 3)
            .attr('x', d => d['children'] ? -8 : 8)
            .attr('class', d => d['children'] ? 'internal': 'leaf')
            .text(_ => {
              return node.data.name;
            });
        }
      });

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

export default TreeManager;
