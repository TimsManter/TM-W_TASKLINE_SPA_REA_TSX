import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";

interface P { }
interface S {
  msg: string;
}

export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.state = {
      msg: "Send Nudes"
    };
  }

  render(): JSX.Element {
    return (
      <Grid fluid={true}>
        <Row>
          <Col>
            {this.state.msg}
          </Col>
        </Row>
      </Grid>
    );
  }
}