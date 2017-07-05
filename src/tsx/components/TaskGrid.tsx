import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";

import Pool from "./Pool";

interface P { }
interface S {
  
}

export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.state = {
      
    };
  }

  render(): JSX.Element {
    return (
      <Grid fluid={true}>
        <Pool />
        <Pool />
        <Pool />
        <Pool />
      </Grid>
    );
  }
}