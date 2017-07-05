import * as React from "react";
import { Panel, Col } from "react-bootstrap";

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
      <Col xs={this.props.size}>
        <Panel className="task-wrapper">
          {this.props.children}
        </Panel>
      </Col>
    );
  }
}