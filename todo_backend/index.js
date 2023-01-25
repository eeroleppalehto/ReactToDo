const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

let todos = [
  {
    id: 1,
    name: "New",
    completed: true,
    created: "2023-01-01T12:00:00.000Z"
  },
  {
    id: 2,
    name: "Sleep",
    completed: false,
    created: "2023-01-23T07:24:51.508Z"
  },
  
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const timeNow = new Date().toDateString()
  res.send(
    `<h1>You have ${todos.length} ToDos left</h1>
    <p>Current time: ${timeNow}</p>`
    )
})

app.get('/api/todos', (req, res) => {
  res.json(todos)
})

app.get('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(todo => todo.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).end();
  }
})


const generateId = () => {
  const maxId = todos.length > 0
  ? Math.max(...todos.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/todos', (req, res) =>{
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const todo = {
    name: body.name,
    completed: body.completed || false,
    created: new Date().toJSON(),
    id: generateId(),
  }

  todos = todos.concat(todo)
  
  res.json(todo)
})

app.put('/api/todos/:id', (req, res) => {
  const body = req.body
  const id = Number(req.params.id)

  const todo = {
    name: body.name,
    completed: body.completed,
    created: body.created,
    id: body.id,
  }

  todos = todos.map(task => task.id !== id ? task : todo)

  res.json(todo) //TODO: What is the deeper meaning of this
  res.status(200).end()
})

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  todos = todos.filter(todo => todo.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})