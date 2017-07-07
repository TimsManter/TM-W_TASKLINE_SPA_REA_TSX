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

const taskSourceSpec: DragSourceSpec<P> = {
  beginDrag(props: P, monitor: DragSourceMonitor, component: Task) {
    return { index: props.index };
  }
};

const taskCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const taskTargetSpec: DropTargetSpec<P> = {
  hover(props, monitor, component) {
    const dragItem = monitor.getItem() as {index: number};
    const dragIndex = dragItem.index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    
    // Time to actually perform the action
    props.moveTask(dragIndex, hoverIndex);
    dragItem.index = hoverIndex;
  },
};

@DropTarget("task", taskTargetSpec, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource("task", taskSourceSpec, (connect, monitor) => ({
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