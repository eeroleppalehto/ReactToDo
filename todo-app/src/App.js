import React, { useState, useEffect } from 'react'

import Form from './components/Form'
import FilterButton from './components/FilterButton'
import Sort from './components/Sort'
import Todo from './components/Todo'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import SortFunctions from './utils/SortFunctions'
import ToDoService from './services/ToDoService'
import loginService from './services/loginService'

// Parent React Component to be rendered
function App() {
  const [tasks, setTasks] = useState([])
  const [sort, setSort] = useState('az')
  const [filter, setFilter] = useState('All')

  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // Fetches all data to be rendered on first render of the page
  useEffect(() => {
    ToDoService.getAll()
      .then(initialNotes => setTasks(initialNotes))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTodoappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      ToDoService.setToken(user.token)
    }
  }, [])


  // Callback function to update task list from Form.js
  function addTask(name) {
    const newTask = { name, completed: false , created: new Date().toJSON() } //FIXME: created is generated bot in front- and backend
    ToDoService
      .create(newTask)
      .then(responseTask => setTasks([...tasks, responseTask]))
      .catch(() => {
        setErrorMessage(`Failed to save todo ${name} `)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  function toggleTaskCompleted(id) {
    const toggleTask = tasks.find(task => task.id === id)
    const toggledTask = { ...toggleTask, completed: !toggleTask.completed }
    ToDoService
      .update(id, toggledTask)
      .then(responseTask =>
        setTasks(tasks.map(task => task.id !== id ? task : responseTask)))
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => task.id !== id)
    ToDoService
      .remove(id)
      .then(() => setTasks(remainingTasks))
  }

  function editTask(id, newName) {
    const editTask = tasks.find(task => task.id === id)
    const editedTask = { ...editTask, name: newName }
    ToDoService
      .update(id, editedTask)
      .then(responseTask =>
        setTasks(tasks.map(task => task.id !== id ? task : responseTask)))
  }


  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  }

  const FILTER_NAMES = Object.keys(FILTER_MAP)


  const sortOptions = [
    { label: 'A-Z', value: 'az', key: 'az' },
    { label: 'Z-A', value: 'za', key: 'za' },
    { label: 'Oldest', value: 'oldest', key: 'oldest' },
    { label: 'Newest', value: 'newest', key: 'newest' }
  ]

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedTodoappUser', JSON.stringify(user)
      )

      ToDoService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedTodoappUser')
    setUser(null)
  }

  /* const SORT_NAMES = Object.keys(SORT_MAP); // TODO: Check if this line is needed */

  // First filter then sort and then generate todos to be rendered on the application
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
  ))

  // Generate
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  const loginForm = () => (
    <Togglable buttonLabel='Login'>
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    </Togglable>
  )

  const todoForm = () => {
    return(
      <Togglable buttonLabel='Add New Todo'>
        <Form addTask={addTask} />
      </Togglable>
    )
  }

  const logoutButton = () => {
    return(
      <div>
        <button className="btn toggle-btn" onClick={() => logout()}>LogOut</button>
      </div>
    )
  }


  // Make the task counter header dynamic
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const headingText = `${taskList.length} ${tasksNoun} remaining`

  return (
    <div className="todoapp stack-large">
      {!user && <h1>Todo App</h1>}
      {user && <h1>{user.name}&apos;s Todos</h1>}
      {user && logoutButton()}
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && todoForm()}
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <Sort sort={sort} setSort={setSort} sortOptions={sortOptions} />
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  )
}

export default App