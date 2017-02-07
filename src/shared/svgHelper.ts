import * as d3 from 'd3';
import { ZoomTransform } from 'd3';

import { d3Node, d3RootNode } from '../types';

export function toHtmlCoords(nodeData) {
  const svg = document.querySelector('svg');
  const ctm = svg.getScreenCTM();
  const pt = svg.createSVGPoint();

  // find dx2 and dy2 stored in root
  let root: d3RootNode = nodeData;

  while (root.parent) {
    root = root.parent;
  }

  const { dx2, dy2 } = root;

  const nodeId = nodeData.data.id;
  const nodeInDOM = document.getElementById(`${nodeId}`);
  const graphDOM = nodeInDOM.parentElement.parentElement;
  const panZoomContainer = graphDOM.children[0];
  const transform = d3.zoomTransform(panZoomContainer);
  const translatedTransform = transform.translate(dx2, dy2);

  const [ xt, yt ] = translatedTransform.apply([nodeData.x, nodeData.y]);
  pt.x = xt;
  pt.y = yt;

  const { x, y } = pt.matrixTransform(ctm);
  return {
    x: x + nodeData.dx,
    y: y + nodeData.dy
  };
}
