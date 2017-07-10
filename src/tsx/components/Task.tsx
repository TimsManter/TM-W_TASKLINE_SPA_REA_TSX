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

interface P {
  index: number;
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
  index: number;
  poolIndex: number;
}

const taskSourceSpec: DragSourceSpec<P> = {
  beginDrag(props: P, monitor: DragSourceMonitor, component: Task) {
    const taskSpec: TaskSpec = {
      id: props.id,
      parentId: props.parentId,
      index: props.index,
      poolIndex: props.poolIndex
    };
    return taskSpec;
  },
  canDrag(props: P) {
    return props.id !== -1;
  }
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
      index: props.index,
      poolIndex: props.poolIndex
    };

    if (dragTaskSpec.id === hoverTaskSpec.id &&
      dragTaskSpec.poolIndex === hoverTaskSpec.poolIndex) { return; }
    
    props.moveTask(dragTaskSpec, hoverTaskSpec, checkTaskPosition(monitor, component));
  },
  hover(props, monitor, component) {
    component.setState({ hover: checkTaskPosition(monitor, component) });
  }
};

const checkTaskPosition = (monitor: DropTargetMonitor, component: Task): string | undefined => {
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
      hover
    } = this.props;

    let opacity: number = 1;
    if (isOver) { opacity = 0.5; }
    else if (isDragging || id === -1) { opacity = 0; }
    else { opacity = 1; }
      
    return connectDragSource(connectDropTarget(
      <div className="task-container" style={{
        opacity,
        borderRightColor: hover === "right" && isOver ? "red" : "transparent",
        borderLeftColor: hover === "left" && isOver ? "red" : "transparent"
      }}>
        {id === 0 && !isDragging ? <Button bsStyle="primary">New Task</Button> :
        (<Panel header={this.props.children}
          className={"task-wrapper task-width-" + this.props.size}>
          {this.props.children}
        </Panel>)}
      </div>
    ));
  }
}