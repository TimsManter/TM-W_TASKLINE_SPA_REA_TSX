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
  moveTask?: (dragTask: TaskSpec, hoverTask: TaskSpec) => void;
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
  //hover(props, monitor, component) { // if swap when hover
  drop(props, monitor, component) { // if swap when drop
    const dragTaskSpec = monitor.getItem() as TaskSpec;
    const hoverTaskSpec: TaskSpec = {
      id: props.id,
      parentId: props.id,
      index: props.index,
      poolIndex: props.poolIndex
    };

    if (dragTaskSpec.index === hoverTaskSpec.index &&
      dragTaskSpec.poolIndex === hoverTaskSpec.poolIndex) { return; }
    
    props.moveTask(dragTaskSpec, hoverTaskSpec);

    /* if swap when hover
    (monitor.getItem() as TaskSpec).index = hoverTaskSpec.index;
    (monitor.getItem() as TaskSpec).poolIndex = hoverTaskSpec.poolIndex;*/
  },
};

@DropTarget("task", taskTargetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  isOver: monitor.isOver()
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
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      canDrop,
      isOver,
      id
    } = this.props;

    let opacity: number = 1;
    if (isOver) { opacity = 0.5; }
    else if (isDragging || id === -1) { opacity = 0; }
      
    return connectDragSource(connectDropTarget(
      <div style={{ opacity }}>
        <Panel header={this.props.children}
          className={"task-wrapper task-width-" + this.props.size}>
          {this.props.children}
        </Panel>
      </div>
    ));
  }
}