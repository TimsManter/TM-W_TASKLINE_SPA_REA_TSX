import * as React from "react";
import { Panel, Col, Clearfix } from "react-bootstrap";
import {
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDragSource
} from "react-dnd";

export interface P {
  size?: number;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
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

@DragSource("task", taskSpec, taskCollector)
export default class Task extends React.Component<P, S> {
  static defaultProps?: Partial<P> = {
    size: 1
  };

  constructor(props: P) {
    super(props);
  }

  render(): JSX.Element | null | false {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div>
        <Panel className={"task-wrapper task-width-" + this.props.size}>
          {this.props.children}
        </Panel>
      </div>
    );
  }
}