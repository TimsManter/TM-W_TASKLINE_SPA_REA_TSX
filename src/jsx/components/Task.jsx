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

/* METHODS */
const taskSourceSpec = {
  beginDrag(props, monitor, component) {
    const taskSpec = {
      id: props.id,
      parentId: props.parentId,
      poolIndex: props.poolIndex
    };
    return taskSpec;
  },
  canDrag(props) { return props.id >= 0; }
};

const taskCollector = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const taskTargetSpec = {
  drop(props, monitor, component) {
    const dragTaskSpec = monitor.getItem();
    const hoverTaskSpec = {
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
  canDrop(props, monitor) {
    if (props.id === -2) { return false; }
    const dTask = monitor.getItem();
    if (props.id === dTask.id) { return false; }
    if (props.parentId === dTask.id) { return false; }
    return true;
  }
};

const checkTaskPosition = (monitor, component) => {
  if (component.props.id === -1) { return undefined; }
  if (component.props.id === monitor.getItem().id) { return undefined; }
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
export default class Task extends React.Component {
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