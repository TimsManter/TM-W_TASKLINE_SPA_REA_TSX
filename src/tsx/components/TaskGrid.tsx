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
    this.moveTask = this.moveTask.bind(this);
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
        }
      ]
    };
  }

  moveTask?(dragIndex: number, hoverIndex: number) {
    const { tasks } = this.state;
    const tmpTask = tasks[dragIndex];
    tasks[dragIndex] = tasks[hoverIndex];
    tasks[hoverIndex] = tmpTask;
    this.setState({
      tasks: tasks
    });
  }

  render(): JSX.Element | null | false {
    const { tasks } = this.state;
    return (
      <div>
        <Pool>
          {tasks.map((task, i) => (
            <Task key={i} index={i} id={i} moveTask={this.moveTask}>{task.id}</Task>
          ))}
        </Pool>
        <Pool>
          <Task index={1} id={1} size={1}>Hehe</Task>
          <Task index={2} id={2} size={1}>Hehe</Task>
          <Task index={3} id={3} size={1}>Hehe</Task>
        </Pool>
      </div>
    );
  }
}