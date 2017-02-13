import * as React from 'react';
import { Component, PropTypes } from 'react';
import Square from './Square';
import Source from './DragSource';

export default class Board extends Component<any, any> {
  renderSquare(i) {
    const x = i % 8;
    const y = Math.floor(i / 8);

    return (
      <Square x={x} y={y} key={i}/>
    );
  }

  render() {
    const squares = [];
    for (let i = 0; i < 10; i += 1) {
      squares.push(this.renderSquare(i));
    }

    return (
      <svg className="Board">
        {squares}
      </svg>
    );
  }
}
