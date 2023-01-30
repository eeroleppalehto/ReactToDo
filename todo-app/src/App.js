import React, { useState, useEffect } from "react";

import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Sort from "./components/Sort";
import Todo from "./components/Todo";

import SortFunctions from "./utils/SortFunctions";
import ToDoService from './services/ToDoService';

// Parent React Component to be rendered
function App() {
  
  const [tasks, setTasks] = useState([]);

  // Fetches all data to be rendered on first render of the page
  useEffect(() => {
    ToDoService.getAll()
      .then(initialNotes => setTasks(initialNotes))  
  }, [])
  

  // Callback function to update task list from Form.js
  function addTask(name) {
    const newTask = { name, completed: false , created: new Date().toJSON()};
    ToDoService
      .create(newTask)
      .then(responseTask => setTasks([...tasks, responseTask]))
  }

  function toggleTaskCompleted(id) {
    const toggleTask = tasks.find(task => task.id === id);
    const toggledTask = { ...toggleTask, completed: !toggleTask.completed }
    ToDoService
      .update(id, toggledTask)
      .then(responseTask =>
        setTasks(tasks.map(task => task.id !== id ? task : responseTask)))
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    ToDoService
      .remove(id)
      .then(() => setTasks(remainingTasks));
  }

  function editTask(id, newName) {
    const editTask = tasks.find(task => task.id === id)
    const editedTask = { ...editTask, name: newName}
    ToDoService
      .update(id, editedTask)
      .then(responseTask => 
        setTasks(tasks.map(task => task.id !== id ? task : responseTask)))
  }

  const [filter, setFilter] = useState("All");

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const [sort, setSort] = useState("az");

  /* const SORT_NAMES = Object.keys(SORT_MAP); // TODO: Check if this line is needed */

  // Iterate through tasks list to generate JSX
  const taskList = tasks.filter(FILTER_MAP[filter]).sort(SortFunctions[sort]).map((item) => (
    <Todo
      id={item.id}
      name={item.name}
      completed={item.completed}
      created={item.created}
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
      <h1>Eeron Todo</h1>
        <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <Sort sort={sort} setSort={setSort}/>
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