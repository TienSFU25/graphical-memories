import data from './flare';
import * as d3 from 'd3';
import * as _ from 'lodash';

require('./styles.scss');

const DEBUG = true;

export default class TreeManager {
  private margin;
  private width: number;
  private height: number;
  private g;
  private tree: d3.TreeLayout<any>;
  private root: d3.HierarchyNode<any>;
  private isDragging: boolean;
  private dragger: d3.DragBehavior<any, any, any>;
  private destDragNode;

  constructor(selector: string) {
    // set the dimensions and margins of the graph
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};

    const margin = this.margin;
    this.width = 960 - margin.left - margin.right,
    this.height = 2400 - margin.top - margin.bottom;

    // add the svg canvas
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);

    this.g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

    // convert data to tree structure
    this.tree = d3.tree().size([this.height, this.width - 160]);

    const stratify = d3.stratify().parentId(d => {
      return d['id'].substring(0, d['id'].lastIndexOf('.'));
    });

    this.root = stratify(data);

    // drag behavior setup
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
          self.moveTo(d, self.destDragNode);
          self.destDragNode = null;
        }
      });

    this.update(true);
  }

  update(initial = false, source = this.root) {
    const root = this.root;

    this._sortTree();

    if (initial) {
      this._attachMids();
    }

    this._updateIdsByMids();
    this.tree(this.root);

    const t = d3.transition('myT').duration(750);

    const nodes = this.g.selectAll('.node')
      .call(this.dragger)
      .data(root.descendants(), d => d['id']);

    nodes.transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    // refresh the text
    nodes.selectAll('text')
      .attr('dy', 3)
      .attr('x', d => d['children'] ? -8 : 8)
      .attr('class', d => d['children'] ? 'internal': 'leaf')
      .text(node => {
        let base = node['id'].substring(node['id'].lastIndexOf('.') + 1);

        if (DEBUG) {
          base += `:\\${node['height']}\\${node['depth']}\\${this._isDefined(node['children']) ? node['children'].length : -1}\\${this._isDefined(node['_children']) ? node['_children'].length : -1}`;
        }

        return base;
      });

    const enterNodes = nodes.enter().append('g');

    enterNodes
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .transition(t)
      .attr('class', d => { const className = d['children'] ? 'internal': 'leaf'; return `node ${className}`; })
      .attr('transform', d => `translate(${d['y']}, ${d['x']})`)
      .attr('style', 'fill-opacity: 1');

    // need to preserve 'this'
    const self = this;

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
      .attr('r', 4.5)
      .on('click', thisNode =>
      {
        this._toggle(thisNode);
        this.update(false, thisNode);
      });

    enterNodes.append('text')
      .attr('dy', 3)
      .attr('x', d => d['children'] ? -8 : 8)
      .attr('class', d => d['children'] ? 'internal': 'leaf')
      .text(node => {
        let base = node['id'].substring(node['id'].lastIndexOf('.') + 1);

        if (DEBUG) {
          base += `:\\${node.height}\\${node.depth}\\${this._isDefined(node.children) ? node.children.length : -1}\\${this._isDefined(node['_children']) ? node['_children'].length : -1}`;
        }

        return base;
      });

    const exitNodes = nodes.exit()
      .transition(t)
      .attr('transform', `translate(${source['y']}, ${source['x']})` )
      .attr('style', 'fill-opacity: 1e-6')
      .remove();

    const links = this.g.selectAll('.link')
      .data(root.descendants().slice(1), d => d['id']);

    links.transition(t)
      .attr('d', d => {
        return `M${d['y']},${d['x']}`
          + `C${d['parent']['y'] + 100},${d['x']}`
          + ` ${d['parent']['y'] + 100},${d['parent']['x']}`
          + ` ${d['parent']['y']},${d['parent']['x']}`
      });

    const enterLinks = links.enter()
      .append('path')
      .attr('d', d => {
        return `M${source['y']},${source['x']}`
          + `C${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
          + ` ${source['y']},${source['x']}`
      })
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

  toggle(node) {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null
    }
  }

  moveTo(src, dest) {
    console.log(`moving ${src.id} to ${dest.id}`);

    const parentDepth = src.parent.depth;
    const destDepth = dest.depth;

    // delete from parent
    let index = src.parent.children.indexOf(src);

    if (index > -1) {
      if (src.parent.children.length == 1) {
        src.parent.children = null;
      } else {
        src.parent.children.splice(index, 1);
      }
    }

    // update destination node's children
    let children = dest.children || dest._children;

    if (!children) {
      dest.children = [];
    }
    else if (dest._children) {
      this.toggle(dest);
    }

    dest.children.push(src);

    // change parent link
    src.parent = dest;

    // update depths
    const visitor = (node, {parentDepth, destDepth}) => {
      node.depth = node.depth - parentDepth + destDepth;
    };

    this._visit(src, {parentDepth, destDepth}, visitor);

    // updating heights does not seem to matter
    this.update();
  }

  _sortTree() {
    const sorter = (a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase());
    this.root.sort(sorter);
  }

  _attachMids() {
    this.root.descendants().forEach(node => {
      const depth = node.depth;
      node['mid'] = node.id.split('.')[depth];
    });
  }

  _visit(node, args, preFn, postFn=(a, b) => 1) {
    if (node == null) return;

    preFn(node, args);
    const children = node.children || node._children;

    _.forEach(children, child => {
      this._visit(child, args, preFn, postFn);
    });

    postFn(node, args);
  }

  _updateIdsByMids() {
    const preVisitor = (node, mids) => {
      mids.push(node.mid);
      node.id = mids.join('.');
    };

    const postVisitor = (node, mids) => mids.pop();

    this._visit(this.root, [], preVisitor, postVisitor);
  }

  _isDefined(e) {
    if (e === null || typeof(e) === "undefined") {
      return false;
    } else {
      return true;
    }
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
