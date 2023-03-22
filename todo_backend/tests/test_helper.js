const Todo = require('../models/todo')
const User = require('../models/user')

const initialTodos =[
    {
      name: "VS Code rest client is pretty handy",
      completed: true,
      created: "2023-01-22T08:23:62.486Z"
    },
    {
      name: "Test successfully run",
      completed: false,
      created: "2023-01-22T08:22:55.486Z"
    },
  ]

const nonExistingId = async () => {
  const todo = new Todo({ name: 'willremovethissoon' })
  await todo.save()
  await todo.remove()

  return todo._id.toString()
}

const todosInDb = async () => {
  const todos1 = await Todo.find({})
  return todos1.map(todo => todo.toJSON())
}



const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialTodos,
  nonExistingId,
  todosInDb,
  usersInDb,
}