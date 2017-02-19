import * as React from 'react';
import * as d3 from 'd3';
import * as TransitionGroup from 'react-addons-transition-group';

import { d3Node } from '../types';
import FatLink from './FatLink';
import LinkNode from './LinkNode';
import Wrapper from './NodeWrapper';

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

export default class LinkAsNodeTree extends React.Component<ITreeManagerProps, any> {
  private wrappers = {};

  render() {
    const { graph, selectedNode, onRectClick, ...passThroughProps } = this.props;
    let links = <g />;
    let nodes = <g />;

    if (graph) {
      const {treeRoot, updateNode} = graph;
      const all = treeRoot.descendants();
      const allButRoot = treeRoot.descendants().slice(1);
      // console.log(`updating with ${data.length} links...`);

      links = allButRoot.map((d: d3Node) => {
        // console.log(d);
        return <FatLink display={graph.display} node={d} source={updateNode} key={`link-${d.data.id}`}/>
      });

      nodes = all.map((d: d3Node) => {
        const nodeId = d.data.id;
        const isSelectedNode = selectedNode && d.data.id === selectedNode.data.id;

        let WrappedNode = this.wrappers[nodeId];

        if (!WrappedNode) {
          WrappedNode = Wrapper(LinkNode);
          this.wrappers[nodeId] = WrappedNode;
        }

        return <WrappedNode display={graph.display} node={d} source={updateNode} key={`node-${d.data.id}`} isSelectedNode={isSelectedNode} {...passThroughProps}/>
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
