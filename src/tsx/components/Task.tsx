import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Col, Clearfix } from "react-bootstrap";
import {
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDragSource,
  DropTarget,
  DropTargetCollector,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
  ConnectDropTarget
} from "react-dnd";

export interface P {
  index: number;
  id: number;
  size?: number;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  moveTask?: (dragIndex: number, hoverIndex: number) => void;
}
export interface S { }

const taskSpec: DragSourceSpec<P> = {
  beginDrag(props: P) {
    return {};
  }
};

const taskCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const taskTarget: DropTargetSpec<P> = {
  hover(props, monitor, component) {
    const dragIndex = (monitor.getItem() as {index: number}).index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveTask(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    (monitor.getItem() as {index: number}).index = hoverIndex;
  },
};

@DropTarget("task", taskTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource("task", taskSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Task extends React.Component<P, S> {
  static defaultProps?: Partial<P> = {
    size: 1
  };

  constructor(props: P) {
    super(props);
  }

  render(): JSX.Element | null | false {
    const { connectDragSource, connectDropTarget, isDragging } = this.props;
    return connectDragSource(connectDropTarget(
      <div>
        <Panel className={"task-wrapper task-width-" + this.props.size}>
          {this.props.children}
        </Panel>
      </div>
    ));
  }
}