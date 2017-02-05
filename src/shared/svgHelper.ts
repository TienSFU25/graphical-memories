import * as d3 from 'd3';
import { ZoomTransform } from 'd3';

import { d3Node } from '../types';

export function toHtmlCoords(nodeData, transform: ZoomTransform) {
  const svg = document.querySelector('svg');
  const ctm = svg.getScreenCTM();
  const pt = svg.createSVGPoint();
  const [ xt, yt ] = transform.apply([nodeData.x, nodeData.y]);
  pt.x = xt;
  pt.y = yt;

  const { x, y } = pt.matrixTransform(ctm);
  return {
    x: x + nodeData.dx,
    y: y + nodeData.dy
  };
}
