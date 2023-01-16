import React, { useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Sort from "./components/Sort";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

// Parent React Component to be rendered
function App({ initalTasks }) {
  const [tasks, setTasks] = useState(initalTasks);

  // Callback function to update task list from Form.js
  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const [filter, setFilter] = useState("All");

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const [sort, setSort] = useState("az");

  const az_sort = (itemA, itemB) => {
    const nameA = itemA.name.toUpperCase(); // ignore upper and lowercase
    const nameB = itemB.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  };

  const za_sort = (itemAr, itemBr) => {
    const nameA = itemAr.name.toUpperCase(); // ignore upper and lowercase
    const nameB = itemBr.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }

    // names must be equal
    return 0;
  };


  const SORT_MAP = {
    "az": az_sort, // Can this be empty or () => ()
    "za": za_sort,
  };

  const SORT_NAMES = Object.keys(SORT_MAP); // TODO: Check if this line is needed

  // Iterate through tasks list to generate JSX
  const taskList = tasks.filter(FILTER_MAP[filter]).sort(SORT_MAP[sort]).map((item) => (
    <Todo
      id={item.id}
      name={item.name}
      completed={item.completed}
      key={item.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  // Make the task counter header dynamic
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
        <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <div>
        <Sort sort={sort} setSort={setSort}/>
      </div>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;