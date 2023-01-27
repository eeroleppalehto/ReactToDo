require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

const Todo = require('./models/todo')


const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  
  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  }
  
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/* app.get('/info', (req, res) => {
  const timeNow = new Date().toDateString()
  res.send(
    `<h1>You have ${todos.length} ToDos left</h1>
    <p>Current time: ${timeNow}</p>`
    )
}) */

app.get('/api/todos', (req, res) => {
  Todo.find({}).then(todos =>{
    res.json(todos)
  })
})

app.get('/api/todos/:id', (req, res, next) => {
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

app.post('/api/todos', (req, res) =>{
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const todo = new Todo ({
    name: body.name,
    completed: body.completed || false,
    created: new Date().toJSON(),
  })
  
  todo.save().then(savedTodo => {
    res.json(savedTodo)
  })  
})

app.put('/api/todos/:id', (req, res, next) => {
  const body = req.body

  const todo = {
    name: body.name,
    completed: body.completed,
    created: body.created,
  }

  Todo.findByIdAndUpdate(req.params.id, todo, {new: true})
    .then(updatedTodo =>{
      res.json(updatedTodo)
    })
    .catch(error => next(error))

  /* todos = todos.map(task => task.id !== id ? task : todo)

  res.json(todo) //TODO: What is the deeper meaning of this
  res.status(200).end() */
})

app.delete('/api/todos/:id', (req, res, next) => {
  Todo.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})