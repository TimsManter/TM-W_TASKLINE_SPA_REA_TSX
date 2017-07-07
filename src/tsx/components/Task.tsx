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
  id: number;
  size?: number;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  moveTask?: (dragTask: TaskSpec, hoverTask: TaskSpec) => void;
}
interface S { }

export interface TaskSpec {
  index: number;
  poolIndex: number;
}

const taskSourceSpec: DragSourceSpec<P> = {
  beginDrag(props: P, monitor: DragSourceMonitor, component: Task) {
    const taskSpec: TaskSpec = {
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
  hover(props, monitor, component) {
    let dragTaskSpec = monitor.getItem() as TaskSpec;
    const hoverTaskSpec: TaskSpec = {
      index: props.index,
      poolIndex: props.poolIndex
    };

    if (dragTaskSpec.index === hoverTaskSpec.index &&
    dragTaskSpec.poolIndex === hoverTaskSpec.poolIndex) { return; }
    
    props.moveTask(dragTaskSpec, hoverTaskSpec);
    dragTaskSpec = hoverTaskSpec;
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