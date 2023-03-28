import React from 'react'
import PropTypes from 'prop-types'

export default function LoginForm({ username, password, handleLogin, setUsername, setPassword }){
  return (
    <>
      <form onSubmit={handleLogin}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
          Login
          </label>
        </h2>
        <div>
          Username
          <input
            type="text"
            className="input input__lg"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            className="input input__lg"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button className="btn toggle-btn" type="submit">login</button>
      </form>
    </>
  )
}

LoginForm.prototype = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword:  PropTypes.func.isRequired
}
