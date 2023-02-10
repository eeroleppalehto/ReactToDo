const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Todo = require('../models/todo')

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

beforeEach(async () => {
  await Todo.deleteMany({})
  let todoObject = new Todo(initialTodos[0])
  await todoObject.save()
  todoObject = new Todo(initialTodos[1])
  await todoObject.save()
})

test('todos are returned as json', async () => {
  await api
    .get('/api/todos')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all todos are returned', async () => {
  const response = await api.get('/api/todos')

  expect(response.body).toHaveLength(initialTodos.length)
})

test('a specific note is within the returned todos', async () => {
  const response = await api.get('/api/todos')

  const names = response.body.map(r => r.name)

  expect(names).toContain("Test successfully run")
})

afterAll(async () => {
  await mongoose.connection.close()
})