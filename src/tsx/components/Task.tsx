import * as React from "react";
import { Panel, Col, Clearfix } from "react-bootstrap";

export interface P {
  size?: number;
}
export interface S { }

export default class Task extends React.Component<P, S> {
  public static defaultProps: Partial<P> = {
    size: 1
  };

  render(): JSX.Element {
    return (
      <div>
        <Panel className={"task-wrapper task-width-" + this.props.size}>
          {this.props.children}
        </Panel>
      </div>
    );
  }
}