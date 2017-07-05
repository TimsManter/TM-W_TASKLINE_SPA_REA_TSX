import * as React from "react";
import { Well, Row } from "react-bootstrap";

import Task from "./Task";

export interface P { }
export interface S { }

export default class Pool extends React.Component<P, S> {
  render(): JSX.Element {
    return (
      <Row>
        <Well className="step-pool">
          <Task size={2}>Send Nudes</Task>
          <Task>Send Nudes</Task>
          <Task>Send Nudes</Task>
          <Task>Send Nudes</Task>
        </Well>
      </Row>
    );
  }
}