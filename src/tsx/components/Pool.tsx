import * as React from "react";
import { Well, Row } from "react-bootstrap";

import Task from "./Task";

export interface P { }
export interface S { }

export default class Pool extends React.Component<P, S> {
  render(): JSX.Element {
    return (
      <div>
        <Well className="step-pool">
          {this.props.children}
        </Well>
      </div>
    );
  }
}