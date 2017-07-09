import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pool from "./Pool";
import Task, { TaskSpec } from "./Task";

interface TTask {
  id: number;
  parentId?: number;
  content: string;
}
interface TPool {
  id: number;
  tasks: TTask[];
}

interface P { 
  calcSize?: (taskId: number, poolIndex: number) => number;
}
interface S {
  pools: TPool[];
}

const calcSize = (grid: TaskGrid, taskId: number, poolIndex: number): number => {
  if (taskId === -1 || poolIndex === undefined) { return 1; }
  let count = 1;
  if (grid.state.pools.length > poolIndex + 1) {
    count = grid.state.pools[poolIndex + 1].tasks.filter(task => {
      return task.parentId === taskId;
    }).length;
  }
  return count === 0 ? 1 : count;
};

const renderChildTasks = (
  grid: TaskGrid,
  pool: TPool,
  poolIndex: number,
  parentPool: TPool): JSX.Element[] => {
  
  const tasks: JSX.Element[] = [];
  let i = 0;
  let k = 0;
  parentPool.tasks.forEach(parentTask => {
    const filteredTasks = pool.tasks.filter(task => task.parentId === parentTask.id);
    if (filteredTasks.length > 0) {
      filteredTasks.forEach((task) => {
        tasks.push(
          <Task key={k}
            index={i}
            poolIndex={poolIndex}
            id={task.id}
            parentId={task.parentId}
            moveTask={grid.moveTask}
            size={calcSize(grid, task.id, poolIndex)}>
            {task.content}
          </Task>
        );
        i++;
        k++;
      });
    }
    else { // dummy task (placeholder)
      tasks.push(
      <Task key={k}
        index={-1}
        poolIndex={poolIndex}
        id={-1}
        parentId={parentTask.id}
        moveTask={grid.moveTask}>
      </Task>
      );
      k++;
    }
  });
  return tasks;
};

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
            { id: 5, parentId: 1, content: "Task 5" },
            { id: 6, parentId: 1, content: "Task 6" },
            { id: 7, parentId: 4, content: "Task 7" },
            { id: 8, parentId: 3, content: "Task 8" },
          ]
        }
      ]
    };
  }

  moveTask?(dragTask: TaskSpec, hoverTask: TaskSpec) {
    const newPools = this.state.pools.slice();
    const hoverPool: TPool = newPools[hoverTask.poolIndex];
    const dragPool: TPool = newPools[dragTask.poolIndex];

    if (hoverTask.poolIndex === dragTask.poolIndex) { // same pool
      if (hoverTask.id > -1) { // normal task
        if (hoverTask.poolIndex === 0) { // master pool, swap tasks
          [hoverPool.tasks[hoverTask.index], dragPool.tasks[dragTask.index]] =
          [dragPool.tasks[dragTask.index], hoverPool.tasks[hoverTask.index]];
        }
        else { // slave pool, swap parentIds
          [hoverPool.tasks[hoverTask.index].parentId, dragPool.tasks[dragTask.index].parentId] =
          [dragPool.tasks[dragTask.index].parentId, hoverPool.tasks[hoverTask.index].parentId];
        }
      } else { // dummy task
        dragPool.tasks[dragTask.index].parentId = hoverTask.parentId;
      }
    } else if (hoverTask.poolIndex === dragTask.poolIndex - 1) { // pool above
      dragPool.tasks[dragTask.index].parentId = hoverPool.tasks[hoverTask.index].id;
    }
    this.setState({ pools: newPools });
  }

  render(): JSX.Element | null | false {
    const pools = this.state.pools.slice();
    return (
      <div>
        {pools.map((pool, i) => (
          <Pool key={i}>
            {i === 0 ?
              (pool.tasks.map((task, j) => (
                <Task key={j}
                  index={j}
                  poolIndex={i}
                  id={task.id}
                  moveTask={this.moveTask}
                  size={calcSize(this, task.id, i)}>
                  {task.content}
                </Task>))) :
              renderChildTasks(this, pool, i, this.state.pools[i - 1])}
          </Pool>
        ))}
        <Pool>{JSON.stringify(this.state, null, 4)}</Pool>
      </div>
    );
  }
}