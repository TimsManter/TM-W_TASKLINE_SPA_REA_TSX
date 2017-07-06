import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pool from "./Pool";
import Task from "./Task";

interface P { }
interface S {
  tasks: {
    id: number;
  }[];
}

@DragDropContext(HTML5Backend)
export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.state = {
      tasks: [
        {
          id: 1
        }, {
          id: 2
        }, {
          id: 3
        }, {
          id: 4
        },
      ]
    };
  }

  private moveTask?(dragIndex: number, hoverIndex: number) {
    let newTasks = this.state.tasks;
    const tmpTask = newTasks[dragIndex];
    newTasks[dragIndex] = newTasks[hoverIndex];
    newTasks[hoverIndex] = tmpTask;
    this.setState({
      tasks: newTasks
    });
  }

  render(): JSX.Element | null | false {
    return (
      <div>
        <Pool>
          {this.state.tasks.map((task, i) => (
            <Task>id: {task.id}, i: {i}</Task>
          ))}
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