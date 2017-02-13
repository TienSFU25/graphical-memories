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

  drop(props, monitor, component) {
    console.log('----------->');
    console.log(`dropped into ${props.x}, ${props.y}`);
    console.log("stuff in beginDrag");
    console.log(monitor.getItem());
    return {
      message: "THIS IS THE RESULT"
    };
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
  beginDrag(props, monitor, component) {
    console.log(`begun dragging ${props.x}, ${props.y}`);
    return {
      foo: "BAR",
      wtf: "does this do"
    };
  },

  endDrag(props, monitor) {
    console.log(monitor.getDropResult());
  }
};

@DragSource(ItemTypes.KNIGHT, knightSource, collect2)
@DropTarget(ItemTypes.KNIGHT, squareTarget, collect)
export default class Square extends Component<any, any> {
  render() {
    const { x, y, connectDropTarget, isOver, canDrop, connectDragSource } = this.props;
    const black = (x + y) % 2 === 1;
    let fill = black ? "white" : "black";
    fill = isOver ? "lightsalmon" : fill;
    const GRID = 20;
    const offset = 10;
    const gx = GRID * x + offset;
    const gy = GRID * y + offset;

    let translate = `translate(${gx}, ${gy})`;

    const DraggableThing = connectDragSource(connectDropTarget(
      <circle r={5} transform={translate}>
        DRAG ME BRO
      </circle>,
    ));

    return (
      <g>
        {DraggableThing}
      </g>
    );
  }
}
