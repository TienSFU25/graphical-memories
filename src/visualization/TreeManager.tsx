import * as React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as TransitionGroup from 'react-addons-transition-group';
import { TweenMax } from 'gsap';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { project, translate } from './treeManipulator';
import { d3Node, TreeType } from '../types';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';
import graphProcessor from './graphProcessor';
import Link from './Link';
import Node from './Node';

import '../css/styles.scss';

const DEBUG = true;

// testing purposes
window['d3'] = d3;

interface ITreeManagerProps {
  graph: any;
  selectedNode: any;
  onRectClick: Function;
  // node specific
  dragBehavior: d3.DragBehavior<any, any, any>;
  onClick: Function;
  onTextClick: Function;
  onMouseOver: Function;
  onMouseOut: Function;
}

class TreeManager extends React.Component<ITreeManagerProps, any> {
  private DOMSelectedNode;
  private transformContainer;
  private panZoomContainer;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const self = this;

    const zoomBehavior = d3.zoom()
      .on('zoom', (d) => {
        console.log('THIS IS THE G ZOOM');
        const transform = self._getZoomTransform();
        this.transformContainer.attr('transform', transform.toString());
      });

    this.panZoomContainer.call(zoomBehavior);

    // this.update(this.props.graph.updateNode, this.props.graph.treeRoot, this.props.graph.display);
  }

  componentWillReceiveProps(nextProps: ITreeManagerProps) {
    if (nextProps.selectedNode) {
      // this.updateSelectedNode(nextProps.selectedNode);
    } else if (this.DOMSelectedNode) {
      // this.clearSelectedNode();
    }

    const shouldUpdate = this.props.graph.updateNode !== nextProps.graph.updateNode;

    if (shouldUpdate) {
      // this.update(nextProps.graph.updateNode, nextProps.graph.treeRoot, nextProps.graph.display);
    }
  }

  onRectClick() {
    this.props.onRectClick(this.props.graph);
    console.log(`clicked the rect`);
  }

  render() {
    const { graph, selectedNode, onRectClick, ...passThroughProps } = this.props;
    let links = <g />;
    let nodes = <g />;

    if (graph) {
      const {treeRoot, updateNode} = graph;
      const all = treeRoot.descendants();
      const allButRoot = treeRoot.descendants().slice(1);
      // console.log(`updating with ${data.length} links...`);

      links = allButRoot.map((d) => {
        return <Link display={graph.display} node={d} source={updateNode} key={`link-${d.data.id}`}/>
      });

      nodes = all.map((d) => {
        return <Node display={graph.display} node={d} source={updateNode} key={`node-${d.data.id}`} {...passThroughProps}/>
      });
    }

    return (
      <g transform={`translate(${graph.dx}, ${graph.dy})`}>
        <rect style={{fill: graph.color, 'pointer-events': "all"}} width={960} height={1200} ref={(rect) => this.panZoomContainer = d3.select(rect)} onClick={this.onRectClick.bind(this)} />
        <g transform={`translate(${graph.treeRoot.dx2}, ${graph.treeRoot.dy2})`} ref={(element) => this.transformContainer = d3.select(element)}>
          <TransitionGroup component="g">
            {links}
          </TransitionGroup>
          <TransitionGroup component="g">
            {nodes}
          </TransitionGroup>
        </g>
      </g>
    );
  }

  clearSelectedNode() {
    this.DOMSelectedNode.attr('class', 'inner');
  }

  _getZoomTransform() {
    const transform = d3.zoomTransform(this.panZoomContainer.node());
    const translatedTransform = transform.translate(this.props.graph.treeRoot.dx2, this.props.graph.treeRoot.dy2);

    return translatedTransform;
  }

  updateSelectedNode(selectedNode) {
    const context = this.transformContainer;
    const root = this.props.graph.treeRoot;
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

  update(source: d3Node, root: d3Node, display: TreeType) {
    console.log(`updating tree from ${source.data.name}`);

    const self = this;
    const context = this.transformContainer;
    const transitionBehavior = d3.transition('myT').duration(750);

    function attachBehaviors() {
      const node = d3.select(this);
      const text = node.select('text');
      const circle = node.select('circle');

      // setup drag and click behaviors
      circle.call(self.props.dragBehavior);
      circle.on('click', (node) => {
        console.log('clicked the circle!');
        self.props.onClick(node);
        d3.event.stopPropagation();
      });

      text.on('click', (thisNode) => {
        self.props.onTextClick(thisNode);
        d3.event.stopPropagation();
      });
    }

    const nodes = context.selectAll('.node')
      .data(root.descendants(), d => d.data.id);

    const enterNodes = nodes.enter().append('g').attr('id', d => d.data.id);

    enterNodes.append('circle')
      .attr('r', 7.5)
      .attr('class', 'inner');

    enterNodes.append('circle')
      .attr('r', 20)
      .attr('class', 'ghost disabled')
      .attr('pointerEvents', 'mouseover')
      .on('mouseover', function(node) {
        self.props.onMouseOver(node, this);
      })
      .on('mouseout', function(node) {
        self.props.onMouseOut(node, this);
      });

    enterNodes
      .merge(nodes)
      .each(function(node) {
        const nodeContainer = d3.select(this);
        const imageContainer = nodeContainer.select('image');
        const textContainer = nodeContainer.select('text');

        const newNodeName = node.data.name;
        const newImgHref = node.data.image;

        if (node.data.image) {
          if (imageContainer.size() == 1) {
            // just update the href
            imageContainer.attr('href', newImgHref);
          } else {
            // create the image
            nodeContainer.append('image')
              .attr('href', node.data.image)
              .attr('width', IMAGE_WIDTH)
              .attr('height', IMAGE_HEIGHT)
              .attr('x', IMAGE_WIDTH * -0.5)
              .attr('y', IMAGE_HEIGHT * -0.5);

            // remove the circle
            nodeContainer.select('circle').remove();
          }
        }

        if (textContainer.size() == 1) {
          textContainer.text(newNodeName);
        } else {
          nodeContainer.append('text')
            .attr('dy', 3)
            .attr('x', (d: d3Node) => d.children ? -8 : 8)
            .attr('class', (d: d3Node) => d.children ? 'internal': 'leaf')
            .text(_ => {
              return node.data.name;
            });
        }
      });

    // stick in DOM
    const sourceTransform = `translate(${source.x}, ${source.y})`;
    const nodeDestTransform = graphProcessor[display].nodeDestTransform;
    // const linkDestTransform = graphProcessor[display].linkDestTransform;

    enterNodes
      .attr('transform', sourceTransform )
      .attr('style', 'fill-opacity: 1e-6')
      .merge(nodes)
      .transition(transitionBehavior)
      .attr('class', (d:d3Node) => {
        const className = d.children ? 'internal': 'leaf';
        return `node ${className}`;
      })
      .attr('transform', nodeDestTransform)
      .attr('style', 'fill-opacity: 1')
      .on('end', attachBehaviors);

    const exitNodes = nodes.exit()
      .transition(transitionBehavior)
      .attr('transform', sourceTransform)
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    // const links = context.selectAll('.link')
    //   .data(root.descendants().slice(1), d => d.data.id);

    // const enterLinks = links.enter()
    //   .insert('path', 'g')
    //   .attr('d', (d: d3Node) => {
    //       return `M${source.x},${source.y}`
    //         + `C${source.x},${source.y}`
    //         + ` ${source.x},${source.y}`
    //         + ` ${source.x},${source.y}`
    //   })
    //   .merge(links)
    //   .transition(transitionBehavior)
    //   .attr('class', 'link')
    //   .attr('d', linkDestTransform);

    // const exitLinks = links.exit()
    //   .transition(transitionBehavior)
    //   .attr('d', d => {
    //     return `M${source.x},${source.y}`
    //       + `C${source.x},${source.y}`
    //       + ` ${source.x},${source.y}`
    //       + ` ${source.x},${source.y}`
    //   })
    //   .remove();
  }
}

export default TreeManager;
