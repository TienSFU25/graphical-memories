import * as React from 'react';
import { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Square from './Square';
import Source from './DragSource';

@DragDropContext(HTML5Backend)
export default class Board extends Component<any, any> {
  renderSquare(i) {
    const x = i % 8;
    const y = Math.floor(i / 8);

    return (
      <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
        <Square x={x} y={y} />
      </div>
    );
  }

  render() {
    const squares = [];
    for (let i = 0; i < 10; i += 1) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div className="Board">
        {squares}
      </div>
    );
  }
}
