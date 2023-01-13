import React, { useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";


// Parent React Component to be rendered
function App({ initalTasks }) {

  const [tasks, setTasks] = useState(initalTasks);


  // Callback function to update task list from Form.js
  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask])
  }

  
  // Iterate through tasks list to generate JSX
  const taskList = tasks.map((item) => (
    <Todo
    id={item.id}
    name={item.name}
    completed={item.completed}
    key={item.id}
    />
    ));

  // Make the task counter header dynamic
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
    
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        <FilterButton name="All"/>
        <FilterButton name="Active"/>
        <FilterButton name="Completed"/>
      </div>
      <h2 id="list-heading">{headingText}</h2>
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
