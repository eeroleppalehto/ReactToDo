const todosRouter = require('express').Router()
const Todo = require('../models/todo')

todosRouter.get('/', (req, res) => {
  Todo.find({}).then(todos =>{
    res.json(todos)
  })
})

todosRouter.get('/:id', (req, res, next) => {
  Todo.findById(req.params.id)
    .then(todo => {
      if (todo) {
        res.json(todo)
      } else {
        res.status(404).end()
      }  
    })
    .catch(error => next(error))
})

todosRouter.post('/', (req, res, next) =>{
  const body = req.body

  const todo = new Todo ({
    name: body.name,
    completed: body.completed || false,
    created: new Date().toJSON(),
  })
  
  todo.save()
    .then(savedTodo => {
      res.json(savedTodo)
    })
    .catch(error => next(error))
})

todosRouter.put('/:id', (req, res, next) => {
  const body = req.body

  const todo = {
    name: body.name,
    completed: body.completed,
    created: body.created,
  }

  Todo.findByIdAndUpdate(req.params.id, todo, {new: true, runValidators: true, context: 'query'})
    .then(updatedTodo =>{
      res.json(updatedTodo)
    })
    .catch(error => next(error))
})

todosRouter.delete('/:id', (req, res, next) => {
  Todo.findByIdAndRemove(req.params.id)
    .then( () => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = todosRouter