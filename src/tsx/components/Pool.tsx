import * as React from "react";
import { Well, Row } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Task from "./Task";

export interface P { }
export interface S { }

@DragDropContext(HTML5Backend)
export default class Pool extends React.Component<P, S> {
  
  render(): JSX.Element | false | null {
    return (
      <div>
        <Well className="step-pool">
          {this.props.children}
        </Well>
      </div>
    );
  }
}