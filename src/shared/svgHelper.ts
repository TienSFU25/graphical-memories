import * as d3 from 'd3';

import { d3Node } from '../types';

export function toHtmlCoords(node) {
  const svg = document.querySelector('svg');
  const ctm = svg.getScreenCTM();
  const pt = svg.createSVGPoint();
  pt.x = node.x;
  pt.y = node.y;

  const { x, y } = pt.matrixTransform(ctm);
  return {
    x: x + node.dx,
    y: y + node.dy
  };
}
