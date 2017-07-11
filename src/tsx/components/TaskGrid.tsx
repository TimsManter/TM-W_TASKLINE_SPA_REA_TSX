/* IMPORTS */
import * as React from "react";
import {
  Grid,
  Row,
  Col,
  Navbar,
  Nav,
  NavItem,
  Button,
  ButtonToolbar
} from "react-bootstrap";
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
const renderNavbar = (): JSX.Element => {
  return (<Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">TaskLine</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      <Navbar.Form pullRight>
        <Task poolIndex={-1} id={0}></Task>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>);
};

const calcSize = (
  pools: TPool[],
  taskId: number,
  poolIndex: number): number => {
  let count = 1;
  if (taskId === -1 || pools[poolIndex+1] === undefined) { return count; }
  for (let p = poolIndex+1; p < pools.length; p++) {
    let childIds = getChildIds(pools[p], taskId);
    if (childIds.length > 1) { count += childIds.length - 1; }
    for (let i in childIds) {
      let childsCount = calcSize(pools, childIds[i], poolIndex + 1);
      if (childsCount > 1) { count += childsCount - 1; }
    }
  }
  return count;
};

const renderChildTasks = (
  grid: TaskGrid,
  pools: TPool[],
  poolIndex: number): JSX.Element[] => {
  const currentTasks = pools[poolIndex].tasks;
  const parentTasks = pools[poolIndex - 1].tasks;
  const tasks: JSX.Element[] = [];
  let k = 0;
  let pk = 0;
  for (let p in parentTasks) {
    let childTasks = currentTasks.filter(task =>
      task.parentId === parentTasks[p].id);
    if (grid.placeholders.filter(t => t.poolIndex === poolIndex - 1 &&
      t.id === pk).length > 0) {
      tasks.push(
        <Task key={k}
          poolIndex={poolIndex}
          id={-2}
          parentId={null}
          moveTask={grid.moveTask}>
        </Task>);
      grid.placeholders.push({
        id: k,
        parentId: null,
        poolIndex: poolIndex
      });
      k++;
    }
    if (childTasks.length === 0) {
      tasks.push(
        <Task key={k}
          poolIndex={poolIndex}
          id={-1}
          parentId={parentTasks[p].id}
          moveTask={grid.moveTask}>
        </Task>);
      grid.placeholders.push({
        id: k,
        parentId: parentTasks[p].id,
        poolIndex: poolIndex
      });
      k++;
    }
    else {
      for (let c in childTasks) {
        tasks.push(
          <Task key={k}
            poolIndex={poolIndex}
            id={childTasks[c].id}
            parentId={parentTasks[p].id}
            moveTask={grid.moveTask}
            size={calcSize(grid.state.pools, childTasks[c].id, poolIndex)}>
            {childTasks[c].content}
          </Task>);
        k++;
      }
    }
    pk++;
  }
  return tasks;
};

const swapTasks = (
  pools: TPool[],
  tSpec1: TaskSpec,
  tSpec2: TaskSpec): boolean => {
  const tasks1: TTask[] = pools[tSpec1.poolIndex].tasks;
  const tasks2: TTask[] = pools[tSpec2.poolIndex].tasks;
  const tIndex1: number = getIndex(pools[tSpec1.poolIndex], tSpec1);
  const tIndex2: number = getIndex(pools[tSpec2.poolIndex], tSpec2);
  if (tIndex1 === undefined || tIndex2 === undefined) { return false; }
  if (tSpec1.poolIndex === tSpec2.poolIndex) {
    if (tSpec1.poolIndex === 0 || tSpec1.parentId === tSpec2.parentId) {
      [tasks1[tIndex1], tasks2[tIndex2]] = [tasks2[tIndex2], tasks1[tIndex1]];
    } else {
      [tasks1[tIndex1].parentId, tasks2[tIndex2].parentId] =
      [tasks2[tIndex2].parentId, tasks1[tIndex1].parentId];
    }
  } else {
    return false; // TODO: Maybe move implementation here
  }
  return true;
};

const insertTask = (
  pool: TPool,
  tSpecFrom: TaskSpec,
  tSpecTo: TaskSpec,
  position: string | undefined): boolean => {
  const tasks: TTask[] = pool.tasks;
  const tIndexFrom: number = getIndex(pool, tSpecFrom);
  const taskToMove: TTask = tasks.splice(tIndexFrom, 1)[0];
  let tIndexTo: number = getIndex(pool, tSpecTo);
  if (tIndexFrom === undefined || tIndexTo === undefined) { return false; }
  if (position === "right") { tIndexTo++; }
  tasks.splice(tIndexTo, 0, taskToMove);
  if (tSpecFrom.parentId !== tSpecTo.parentId) {
    tasks[tIndexTo].parentId = tSpecTo.parentId;
  }
  return true;
};

const insertNewTask = (
  pools: TPool[],
  tSpec: TaskSpec,
  id: number,
  position?: string | undefined): boolean => {
  const newTask: TTask = {
    id: id,
    content: "New Task"
  };
  if (position === undefined) {
    newTask.parentId = tSpec.id;
    if (pools[tSpec.poolIndex + 1] === undefined) {
      let maxId = tSpec.poolIndex;
      for (let p in pools) {
        if (pools[p].id > maxId) { maxId = pools[p].id; }
      }
      const newPool: TPool = { id: maxId + 1, tasks: [] };
      pools.push(newPool);
    }
    pools[tSpec.poolIndex+1].tasks.push(newTask);
  }
  else {
    if (tSpec.parentId) { newTask.parentId = tSpec.parentId; }
    let tIndexTo: number = getIndex(pools[tSpec.poolIndex], tSpec);
    if (tIndexTo === undefined) { return false; }
    if (position === "right") { tIndexTo++; }
    pools[tSpec.poolIndex].tasks.splice(tIndexTo, 0, newTask);
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

const getIndex = (pool: TPool, specId: TaskSpec | number): number | undefined => {
  const id = typeof specId === "number" ? specId : specId.id;
  const task: TTask = pool.tasks.filter(t => t.id === id)[0];
  if (task === undefined) { return undefined; }
  return pool.tasks.indexOf(task);
};

const moveUpTask = (
  pools: TPool[],
  tSpecFrom: TaskSpec,
  tSpecTo: TaskSpec,
  position: string | undefined) => {
  const parentIndex = getIndex(pools[tSpecFrom.poolIndex], tSpecFrom.id);
  const parentTask = pools[tSpecFrom.poolIndex].tasks.splice(parentIndex, 1)[0];
  let diff: number = tSpecFrom.poolIndex - tSpecTo.poolIndex;
  if (tSpecTo.id === -1) {
    parentTask.parentId = tSpecTo.parentId;
    pools[tSpecTo.poolIndex].tasks.push(parentTask);
    moveUpChildTasks(pools, tSpecFrom.poolIndex, tSpecFrom.id, diff);
    return;
  }
  let tIndexTo = getIndex(pools[tSpecTo.poolIndex], tSpecTo.id);
  let pIndexTo = tSpecTo.poolIndex;
  if (position === undefined) {
    parentTask.parentId = tSpecTo.id;
    diff--;
    pIndexTo++;
  }
  else {
    parentTask.parentId = tSpecTo.parentId;
    if (position === "right") { tIndexTo++; }
  }
  pools[pIndexTo].tasks.splice(tIndexTo, 0, parentTask);
  moveUpChildTasks(pools, tSpecFrom.poolIndex, tSpecFrom.id, diff);
};

const moveUpChildTasks = (
  pools: TPool[],
  poolIndex: number,
  taskId: number,
  diff: number) => {
  if (pools[poolIndex + 1] === undefined) { return; }
  const childIds = getChildIds(pools[poolIndex+1], taskId);
  for (let c in childIds) {
    moveUpChildTasks(pools, poolIndex + 1, childIds[c], diff);
    let childIndex = getIndex(pools[poolIndex + 1], childIds[c]);
    let childTask = pools[poolIndex + 1].tasks.splice(childIndex, 1)[0];
    pools[poolIndex + 1 - diff].tasks.push(childTask);
  }
};

const getChildIds = (pool: TPool, specId: TaskSpec | number): number[] => {
  const id = typeof specId === "number" ? specId : specId.id;
  let ids: number[] = [];
  for (let t in pool.tasks) {
    if (pool.tasks[t].parentId === id) {
      ids.push(pool.tasks[t].id);
    }
  }
  return ids;
};

const getMaxId = (pools: TPool[]): number => {
  let maxId = 0;
  for (let p in pools) {
    for (let t in pools[p].tasks) {
      if (pools[p].tasks[t].id > maxId) {
        maxId = pools[p].tasks[t].id;
      }
    }
  }
  return maxId;
};

/* CLASS */
@DragDropContext(HTML5Backend)
export default class TaskGrid extends React.Component<P, S> {
  placeholders?: TaskSpec[];
  constructor() {
    super();
    this.placeholders = [];
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
        },
        {
          id: 3,
          tasks: [
            { id: 9, parentId: 5, content: "Task 9" },
            { id: 10, parentId: 5, content: "Task 10" }
          ]
        }
      ]
    };
  }

  moveTask?(dTaskSpec: TaskSpec, hTaskSpec: TaskSpec, position?: string | undefined) {
    const newPools = this.state.pools.slice();
    const hPool: TPool = newPools[hTaskSpec.poolIndex];
    const dPool: TPool = newPools[dTaskSpec.poolIndex];
    // TODO: This section require more unify and removing `position` condition
    if (position) {
      if (dTaskSpec.id === 0) {
        insertNewTask(newPools, hTaskSpec, getMaxId(newPools) + 1, position);
      }
      else if (hPool === dPool) {
        insertTask(hPool, dTaskSpec, hTaskSpec, position);
      } else if (hTaskSpec.poolIndex < dTaskSpec.poolIndex) { // up
        moveUpTask(newPools, dTaskSpec, hTaskSpec, position);
      } else {
        // TODO: Add logic to move tasks down
      }
    } else {
      if (dTaskSpec.id === 0) {
        insertNewTask(newPools, hTaskSpec, getMaxId(newPools) + 1);
      }
      else if (hPool === dPool) {
        if (hTaskSpec.id > 0) { // normal task
          swapTasks(newPools, dTaskSpec, hTaskSpec);
        } else { // dummy task
          changeParentId(dPool, dTaskSpec, hTaskSpec.parentId);
        }
      } else if (hTaskSpec.poolIndex < dTaskSpec.poolIndex) { // up
        moveUpTask(newPools, dTaskSpec, hTaskSpec, position);
      } else {
        // TODO: Add logic to move tasks down
      }
    }
    this.setState({ pools: newPools });
  }

  render(): JSX.Element | null | false {
    const pools = this.state.pools.slice();
    return (
      <div>
        {renderNavbar()}
        {pools.map((pool, i) => (
          <Pool key={i}>
            {i === 0 ?
              (pool.tasks.map((task, j) => (
                <Task key={j}
                  poolIndex={i}
                  id={task.id}
                  moveTask={this.moveTask}
                  size={calcSize(pools, task.id, i)}>
                  {task.content}
                </Task>))) : renderChildTasks(this, pools, i)}
          </Pool>
        ))}{this.placeholders=[]}
        <Pool>{JSON.stringify(this.state, null, 4)}</Pool>
      </div>
    );
  }
}