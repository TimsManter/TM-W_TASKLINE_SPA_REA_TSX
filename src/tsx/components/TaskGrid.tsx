import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pool from "./Pool";
import Task from "./Task";

interface TTask {
  id: number;
  content: string;
}
interface TPool {
  id: number;
  tasks: TTask[];
}

interface P { }
interface S {
  pools: TPool[];
}

@DragDropContext(HTML5Backend)
export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.moveTask = this.moveTask.bind(this);
    this.state = {
      pools: [
        {
          id: 1,
          tasks: [
            { id: 1, content: "Task 1" },
            { id: 2, content: "Task 2" },
            { id: 3, content: "Task 3" },
            { id: 4, content: "Task 4" },
          ]
        },
        {
          id: 2,
          tasks: [
            { id: 5, content: "Task 5" },
            { id: 6, content: "Task 6" },
            { id: 7, content: "Task 7" },
            { id: 8, content: "Task 8" },
          ]
        }
      ]
    };
  }

  moveTask?(dragIndex: number, hoverIndex: number) {/*
    let newTasks = this.state.tasks.slice();
    const tmpTask = newTasks[dragIndex];
    newTasks[dragIndex] = newTasks[hoverIndex];
    newTasks[hoverIndex] = tmpTask;
    this.setState({
      tasks: newTasks
    });*/
  }

  render(): JSX.Element | null | false {
    const pools = this.state.pools.slice();
    return (
      <div>
        {pools.map((pool, i) => (
          <Pool key={i}>
            {pool.tasks.map((task, i) => (
              <Task key={i} index={i} id={task.id} moveTask={this.moveTask}>{task.id}</Task>
            ))}
          </Pool>
        ))}
      </div>
    );
  }
}