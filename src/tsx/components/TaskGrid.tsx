import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pool from "./Pool";
import Task from "./Task";

interface P { }
interface S { }

@DragDropContext(HTML5Backend)
export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.state = {
      
    };
  }

  render(): JSX.Element | null | false {
    return (
      <div>
        <Pool>
          <Task size={3}>Send Nudes</Task>
          <Task>Send Nudes</Task>
        </Pool>
        <Pool>
          <Task size={1}>Hehe</Task>
          <Task size={1}>Hehe</Task>
          <Task size={1}>Hehe</Task>
        </Pool>
      </div>
    );
  }
}