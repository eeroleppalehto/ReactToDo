// Routes for handling request involing todos

const todosRouter = require('express').Router()
const Todo = require('../models/todo')

//FIXME: Remove block comments
todosRouter.get('/', async (req, res) => {
  const todos = await Todo.find({})
  res.json(todos)
  /* Todo.find({}).then(todos =>{
    res.json(todos)
  }) */
})

todosRouter.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (todo) {
      res.json(todo)
    } else {
      res.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }

  /* Todo.findById(req.params.id)
    .then(todo => {
      if (todo) {
        res.json(todo)
      } else {
        res.status(404).end()
      }  
    })
    .catch(error => next(error)) */
})

todosRouter.post('/', async (req, res, next) =>{
  const body = req.body

  const todo = new Todo ({
    name: body.name,
    completed: body.completed || false,
    created: new Date().toJSON(),
  })
  
  try {
    const savedTodo = await todo.save()
    res.status(201).json(savedTodo)
  } catch (exception) {
    next(exception)
  }
})

todosRouter.put('/:id', async (req, res, next) => {
  const body = req.body

  const todo = {
    name: body.name,
    completed: body.completed,
    created: body.created,
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, todo, {new: true, runValidators: true, context: 'query'})
    res.status(200).json(updatedTodo)
  } catch (exception) {
    next(exception)
  }

  /* Todo.findByIdAndUpdate(req.params.id, todo, {new: true, runValidators: true, context: 'query'})
    .then(updatedTodo =>{
      res.json(updatedTodo)
    })
    .catch(error => next(error)) */
})

todosRouter.delete('/:id', async (req, res, next) => {
  try {
    await Todo.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }

  /* Todo.findByIdAndRemove(req.params.id)
    .then( () => {
      res.status(204).end()
    })
    .catch(error => next(error)) */
})

module.exports = todosRouter