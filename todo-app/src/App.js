import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Sort from "./components/Sort";
import Todo from "./components/Todo";
import ToDoService from './services/ToDoService';
import { nanoid } from "nanoid";

// Parent React Component to be rendered
function App() {
  
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    ToDoService.getAll()
      .then(initialNotes => setTasks(initialNotes))  
  }, [])
  

  // Callback function to update task list from Form.js
  function addTask(name) {
    const newTask = { name, completed: false , created: new Date().toJSON()}; // TODO: Also remove the id attribute. Removed: id: `todo-${nanoid()}`, 
    ToDoService
      .create(newTask)
      .then(responseTask => setTasks([...tasks, responseTask]))

    // setTasks([...tasks, newTask]); // TODO: Add new task to db.json via axios
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

  const oldest_sort = (a, b) => {
    return new Date(a.created).valueOf() - new Date(b.created).valueOf();
  };

  const newest_sort = (a, b) => {
    return new Date(b.created).valueOf() - new Date(a.created).valueOf();
  };


  const SORT_MAP = {
    "az": az_sort, // Can this be empty or () => ()
    "za": za_sort,
    "oldest": oldest_sort,
    "newest": newest_sort,
  };

  const SORT_NAMES = Object.keys(SORT_MAP); // TODO: Check if this line is needed

  // Iterate through tasks list to generate JSX
  const taskList = tasks.filter(FILTER_MAP[filter]).sort(SORT_MAP[sort]).map((item) => (
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