import React, { useState } from 'react'

// React component for either viewing or editing saved task
export default function Todo({ name, completed, id, created, toggleTaskCompleted, deleteTask, editTask }) {
  const [isEditing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  const dateTime = new Date(created)
  const time = dateTime.toLocaleTimeString('it-IT')
  const date = dateTime.toDateString()

  // Sets the newName as what user has typed on the input field
  function handleChange(e) {
    setNewName(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (newName !== '') {
      editTask(id, newName)
    }
    setNewName('')
    setEditing(false)
  }

  //JSX Template for editing a task
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={id}>
          New name for {name}
        </label>
        <input id={id} className="todo-text" type="text" value={newName} onChange={handleChange}/>
      </div>
      <div className="btn-group">
        <button type="button" className="btn todo-cancel" onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {name}</span>
        </button>
      </div>
    </form>
  )

  // JSX Template for viewing a task
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={id}
          type="checkbox"
          className="test"
          defaultChecked={completed}
          onChange={() => toggleTaskCompleted(id)}
        />
        <label className="todo-label" htmlFor={id}>
          {name}
        </label>
        <label className="todo-label">
          {date} {time}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => deleteTask(id)}
        >
          Delete <span className="visually-hidden">{name}</span>
        </button>
      </div>
    </div>
  )

  // Conditionally render either editing or view template depending the state of 'isEditing'
  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>

}
