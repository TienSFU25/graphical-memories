import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import graphManipulationActions from '../graphMetadata/graphManipulationActions';
import { project, translate } from './treeManipulator';
import { d3Node, TreeType } from '../types';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';

import '../css/styles.scss';
import './dropdown.scss';

import classie from './classie';

declare var Snap: any;
declare var mina: any;

const DEBUG = true;

// testing purposes
window['d3'] = d3;

interface ITreeManagerProps {
  dragBehavior: d3.DragBehavior<any, any, any>;
  onClick: Function;
  onTextClick: Function;
  onMouseOver: Function;
  onMouseOut: Function;
  root;
  updateNode;
  selectedNode;
  display;
}

				function SVGDDMenu( el ) {
					this.el = el;
					this.init();
				}

				SVGDDMenu.prototype.init = function() {
					this.shapeEl = this.el.querySelector( 'div.morph-shape' );

					var s = Snap( this.shapeEl.querySelector( 'g' ) );
					this.pathEl = s.select( 'path' );
					this.paths = {
						reset : this.pathEl.attr( 'd' ),
						open : this.shapeEl.getAttribute( 'data-morph-open' )
					};

					this.isOpen = false;

					this.initEvents();
				};

				SVGDDMenu.prototype.initEvents = function() {
					this.el.addEventListener( 'click', this.toggle.bind(this) );
				};

				SVGDDMenu.prototype.toggle = function() {
          console.log('dis me toggling');
					var self = this;

					if( this.isOpen ) {
						classie.remove( self.el, 'menu--open' );
					}
					else {
						classie.add( self.el, 'menu--open' );
					}

					this.pathEl.stop().animate( { 'path' : this.paths.open }, 320, mina.easeinout, function() {
						self.pathEl.stop().animate( { 'path' : self.paths.reset }, 1000, mina.elastic );
					} );

					this.isOpen = !this.isOpen;
				};

class TreeManager extends React.Component<ITreeManagerProps, any> {
  private DOMSelectedNode;
  private g;

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


				new SVGDDMenu( document.getElementById( 'menuism' ) );


    this.setState({
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
      <g>
        <foreignObject>
          <nav id="menuism" className="menu">
            <div className="morph-shape" data-morph-open="M260,500H0c0,0,8-120,8-250C8,110,0,0,0,0h260c0,0-8,110-8,250C252,380,260,500,260,500z">
              <g width="100%" height="100%">
                <path fill="none" d="M260,500H0c0,0,0-120,0-250C0,110,0,0,0,0h260c0,0,0,110,0,250C260,380,260,500,260,500z"></path>
              </g>
            </div>
            <button className="menu__label"><i className="fa fa-fw fa-bars"></i><span>Open Menu</span></button>
            <ul className="menu__inner">
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-bookmark-o"></i><span>Reading List</span></a></li>
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-hdd-o"></i><span>Saved Items</span></a></li>
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-image"></i><span>All Media</span></a></li>
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-heart-o"></i><span>Favorites</span></a></li>
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-envelope-o"></i><span>Messages</span></a></li>
              <li><a href="https://tympanus.net/Development/ElasticSVGElements/dropdown.html#"><i className="fa fa-fw fa-bell-o"></i><span>Notifications</span></a></li>
            </ul>
          </nav>
        </foreignObject>

        <g ref={(element) => this.g = d3.select(element)}/>
      </g>
    );
  }

  clearSelectedNode() {
    this.DOMSelectedNode.attr('class', 'inner');
  }

  updateSelectedNode(selectedNode) {
    const context = this.g;
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
    const context = this.g;
    const root = this.state.root;

    const DELAY = 500;
    const t = d3.transition('myT').duration(750);

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

    // stick in DOM
    const transform = `translate(${source.y}, ${source.x})`;
    let nodeTransform;
    let linkTransform;

    if (this.state.display === TreeType.VerticalTree) {
      nodeTransform = (d: d3Node) => `translate(${d.x}, ${d.y})`;
      linkTransform = (d: d3Node) => {
        return `M${d.x},${d.y}`
          + `C${d.parent.x + 100},${d.y}`
          + ` ${d.parent.x + 100},${d.parent.y}`
          + ` ${d.parent.x},${d.parent.y}`;
      };
    } else if (this.state.display === TreeType.Radial) {
      nodeTransform = (d: d3Node) => `translate(${d.x}, ${d.y})`;
      linkTransform = (d: d3Node) => {
        return "M" + translate(project(d.x0, d.y0), d.dx, d.dy)
            + "C" + translate(project(d.x0, (d.y0 + d.parent.y0) / 2), d.dx, d.dy)
            + " " + translate(project(d.parent.x0, (d.y0 + d.parent.y0) / 2), d.dx, d.dy)
            + " " + translate(project(d.parent.x0, d.parent.y0), d.dx, d.dy);
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
