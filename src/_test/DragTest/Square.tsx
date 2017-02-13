import * as React from 'react';
import { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  KNIGHT: "fsd"
};

const squareTarget = {
  canDrop(props) {
    return true;
  },

  drop(props) {
    console.log(`dropped into ${props.x}, ${props.y}`);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

// drag source shit
function collect2(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const knightSource = {
  beginDrag(props) {
    console.log(`begun dragging ${props.x}, ${props.y}`);
    return {
      foo: "BAR",
      wtf: "does this do"
    };
  },
};

@DragSource(ItemTypes.KNIGHT, knightSource, collect2)
@DropTarget(ItemTypes.KNIGHT, squareTarget, collect)
export default class Square extends Component<any, any> {
  render() {
    const { x, y, connectDropTarget, isOver, canDrop, connectDragSource } = this.props;
    const black = (x + y) % 2 === 1;
    let fill = black ? "white" : "black";
    fill = isOver ? "lightsalmon" : fill;

    return connectDragSource(connectDropTarget(
      <div width={30} height={30} style={{backgroundColor: fill, display: "inline"}}>
        DRAG ME BRO
      </div>,
    ));
  }
}
