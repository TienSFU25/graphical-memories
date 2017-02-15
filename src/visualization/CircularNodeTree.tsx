import * as React from 'react';
import * as d3 from 'd3';
import * as TransitionGroup from 'react-addons-transition-group';

import { d3Node } from '../types';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';
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
  zoomEnabled: boolean;
  // node specific
  dragBehavior: d3.DragBehavior<any, any, any>;
  onTextClick: Function;
  onMouseOver: Function;
  onMouseOut: Function;
}

export default class CircularNodeTree extends React.Component<ITreeManagerProps, any> {
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
        // console.log(d);
        return <Link display={graph.display} node={d} source={updateNode} key={`link-${d.data.id}`}/>
      });

      nodes = all.map((d) => {
        const isSelectedNode = selectedNode && d.data.id === selectedNode.data.id;

        return <Node display={graph.display} node={d} source={updateNode} key={`node-${d.data.id}`} isSelectedNode={isSelectedNode} {...passThroughProps}/>
      });
    }

    return (
      <TransitionGroup component="g">
        {links}
        {nodes}
      </TransitionGroup>
    );
  }
}
