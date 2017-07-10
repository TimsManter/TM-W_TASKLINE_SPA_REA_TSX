/* IMPORTS */
import * as React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pool from "./Pool";
import Task, { TaskSpec } from "./Task";

/* INTERFACES */
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

/* METHODS */
const calcSize = (
  grid: TaskGrid,
  taskId: number,
  poolIndex: number): number => {
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

const swapTasks = (
  pool: TPool,
  tSpec1: TaskSpec,
  tSpec2: TaskSpec): boolean => {
  const tasks: TTask[] = pool.tasks;
  const task1: TTask = tasks.filter(t => t.id === tSpec1.id)[0];
  const task2: TTask = tasks.filter(t => t.id === tSpec2.id)[0];
  if (task1 === undefined || task2 === undefined) { return false; }
  const tIndex1: number = tasks.indexOf(task1);
  const tIndex2: number = tasks.indexOf(task2);
  if (tSpec1.poolIndex === 0 || tSpec1.parentId === tSpec2.parentId) {
    [tasks[tIndex1], tasks[tIndex2]] = [tasks[tIndex2], tasks[tIndex1]];
  } else {
    [tasks[tIndex1].parentId, tasks[tIndex2].parentId] =
    [tasks[tIndex2].parentId, tasks[tIndex1].parentId];
  }
  return true;
};

const changeParentId = (
  pool: TPool,
  tSpec: TaskSpec,
  newId: number | TaskSpec): boolean => {
  const tasks: TTask[] = pool.tasks;
  const task: TTask = tasks.filter(t => t.id === tSpec.id)[0];
  if (task === undefined) { return false; }
  const tIndex: number = tasks.indexOf(task);
  if (typeof newId === "number") {
    tasks[tIndex].parentId = newId;
  } else {
    tasks[tIndex].parentId = newId.id;
  }
  return true;
};

/* CLASS */
@DragDropContext(HTML5Backend)
export default class TaskGrid extends React.Component<P, S> {
  constructor() {
    super();
    this.moveTask = this.moveTask.bind(this);
    this.state = {
      pools: [ // sample data
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

  moveTask?(dTaskSpec: TaskSpec, hTaskSpec: TaskSpec) {
    const newPools = this.state.pools.slice();
    const hPool: TPool = newPools[hTaskSpec.poolIndex];
    const dPool: TPool = newPools[dTaskSpec.poolIndex];

    if (hPool === dPool) {
      if (hTaskSpec.id > -1) { // normal task
        swapTasks(dPool, dTaskSpec, hTaskSpec);
      } else { // dummy task
        changeParentId(dPool, dTaskSpec, hTaskSpec.parentId);
      }
    } else if (hTaskSpec.poolIndex === dTaskSpec.poolIndex - 1) {
      changeParentId(dPool, dTaskSpec, hTaskSpec);
    } else {
      // TODO: Add moving between many pools logic
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