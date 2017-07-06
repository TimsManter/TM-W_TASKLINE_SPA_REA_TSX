import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";

import Pool from "./Pool";
import Task from "./Task";

interface P { }
interface S { }

export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.state = {
      
    };
  }

  render(): JSX.Element {
    return (
      <Grid fluid={true}>
        <Pool>
          <Task size={3}>Send Nudes</Task>
          <Task>Send Nudes</Task>
        </Pool>
        <Pool>
          <Col xs={3}>
            <Task size={4}>Hehe</Task>
            <Task size={4}>Hehe</Task>
            <Task size={4}>Hehe</Task>
          </Col>
        </Pool>
      </Grid>
    );
  }
}