import React from "react";

export default function Todo({ name, completed, id, toggleTaskCompleted, deleteTask }) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input id={id} type="checkbox" defaultChecked={completed} onChange={() => toggleTaskCompleted(id)}/>
        <label className="todo-label" htmlFor="todo-0">
          {name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
          Edit <span className="visually-hidden">{name}</span>
        </button>
        <button type="button" className="btn btn__danger" onClick={() => deleteTask(id)}>
          Delete <span className="visually-hidden">{name}</span>
        </button>
      </div>
    </li>
  );
}
