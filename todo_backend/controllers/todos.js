// Routes for handling request involing todos
const todosRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
const User = require('../models/user')

todosRouter.get('/', async (req, res) => {
  const todos = await Todo
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(todos)
})

todosRouter.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  if (todo) {
    res.json(todo)
  } else {
    res.status(404).end()
  }
})

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

todosRouter.post('/', async (req, res) =>{
  const body = req.body

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const todo = new Todo ({
    name: body.name,
    completed: body.completed || false,
    created: new Date().toJSON(),
    user: user._id
  })
  
  const savedTodo = await todo.save()
  user.todos = user.todos.concat(savedTodo._id)
  await user.save()
  
  res.status(201).json(savedTodo)
})

todosRouter.put('/:id', async (req, res) => {
  const body = req.body

  const todo = {
    name: body.name,
    completed: body.completed,
    created: body.created,
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, todo, {new: true, runValidators: true, context: 'query'})
  res.status(200).json(updatedTodo)
})

todosRouter.delete('/:id', async (req, res) => {
  await Todo.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = todosRouter