/* IMPORTS */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Col, Clearfix, Button } from "react-bootstrap";
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

/* INTERFACES */
interface P {
  poolIndex: number;
  parentId?: number;
  id: number;
  size?: number;
  isDragging?: boolean;
  canDrop?: boolean;
  isOver?: boolean;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  moveTask?: (dragTask: TaskSpec, hoverTask: TaskSpec, position?: string | undefined) => void;
  hover?: string;
}
interface S { }

export interface TaskSpec {
  id: number;
  parentId: number;
  poolIndex: number;
}

export interface PoolView {
  key: number;
  id: number;
  tasks: TaskView[];
}

export interface TaskView {
  key: number;
  poolIndex: number;
  id: number;
  parentId?: number;
  size: number;
  content?: string;
}

/* METHODS */
const taskSourceSpec: DragSourceSpec<P> = {
  beginDrag(props: P, monitor: DragSourceMonitor, component: Task) {
    const taskSpec: TaskSpec = {
      id: props.id,
      parentId: props.parentId,
      poolIndex: props.poolIndex
    };
    return taskSpec;
  },
  canDrag(props: P) { return props.id >= 0; }
};

const taskCollector = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const taskTargetSpec: DropTargetSpec<P> = {
  drop(props, monitor, component) {
    const dragTaskSpec = monitor.getItem() as TaskSpec;
    const hoverTaskSpec: TaskSpec = {
      id: props.id,
      parentId: props.parentId,
      poolIndex: props.poolIndex
    };
    if (dragTaskSpec.id === hoverTaskSpec.id &&
      dragTaskSpec.poolIndex === hoverTaskSpec.poolIndex) { return; }
    
    props.moveTask(dragTaskSpec, hoverTaskSpec, checkTaskPosition(monitor, component));
  },
  hover(props, monitor, component) {
    component.setState({ hover: checkTaskPosition(monitor, component) });
  },
  canDrop(props: P, monitor: DropTargetMonitor) {
    if (props.id === -2) { return false; }
    const dTask = monitor.getItem() as TaskSpec;
    if (props.id === dTask.id) { return false; }
    if (props.parentId === dTask.id) { return false; }
    return true;
  }
};

const checkTaskPosition = (
  monitor: DropTargetMonitor,
  component: Task): string | undefined => {
  if (component.props.id === -1) { return undefined; }
  if (component.props.id === (monitor.getItem() as TaskSpec).id) { return undefined; }
  const taskRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
  const cursorOffset = monitor.getClientOffset();
  const offset = 30;
  if (cursorOffset.x > taskRect.left &&
    cursorOffset.x < taskRect.left + offset) { return "left"; }
  else if (cursorOffset.x < taskRect.right &&
    cursorOffset.x > taskRect.right - offset) { return "right"; }
  else { return undefined; }
};

/* CLASS */
@DropTarget("task", taskTargetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  isOver: monitor.isOver()
}))
@DragSource("task", taskSourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag()
}))
export default class Task extends React.Component<P, S> {
  static defaultProps?: Partial<P> = {
    size: 1
  };
  constructor(props: P) {
    super(props);
  }

  render(): JSX.Element | null | false {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      canDrop,
      isOver,
      id,
      hover,
      size
    } = this.props;

    const width: number = 150 * size;
    let opacity: number = 1;
    if (isOver && canDrop) { opacity = 0.5; }
    else if (isDragging || id < 0) { opacity = 0; }
    else { opacity = 1; }
      
    return connectDragSource(connectDropTarget(
      <div className="task-container" style={{
        opacity,
        borderRightColor: hover === "right" && isOver ? "red" : "transparent",
        borderLeftColor: hover === "left" && isOver ? "red" : "transparent"
      }}>
        {id === 0 && !isDragging ?
          (<Button bsStyle="primary">
            Drag me to create or drop here to remove
          </Button>) :
          (<Panel header={this.props.children}
            className={"task-wrapper"} style={{width}}>
          {this.props.children}
        </Panel>)}
      </div>
    ));
  }
}