import * as React from 'react';
import { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  KNIGHT: "fsd"
};

// drag source shit
function collect2(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const knightSource = {
  beginDrag() {
    console.log('begun dragging!');
    return {};
  },
};

@DragSource(ItemTypes.KNIGHT, knightSource, collect2)
export default class Source extends Component<any, any> {
  render() {
    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div width={30} height={30} style={{backgroundColor: "aliceblue", display: "inline"}}>
        DRAG SOURCE
      </div>
    );
  }
}
