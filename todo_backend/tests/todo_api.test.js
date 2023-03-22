const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Todo = require('../models/todo')

/* const initialTodos =[
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
] */

// Initializes test database before tests
beforeEach(async () => {
  await Todo.deleteMany({})
  //console.log('cleared')

  helper.initialTodos.forEach(async (todo) =>{
    let todoObject = new Todo(todo)
    await todoObject.save()
    //console.log('saved')
  })
})

// Test for checking if todos are returned as JSON
test('todos are returned as json', async () => {
  await api
    .get('/api/todos')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Test for GET method
test('all todos are returned', async () => {
  const response = await api.get('/api/todos')

  expect(response.body).toHaveLength(helper.initialTodos.length)
})

// Test for checking if a specific note is within the returned todos
test('a specific todo is within the returned todos', async () => {
  const response = await api.get('/api/todos')

  const names = response.body.map(r => r.name)

  expect(names).toContain("Test successfully run")
})

// Test for POST method
test('A valid todo can be added', async () => {
  const newTodo = {
    name: 'Try adding a todo (async/await)',
    completed: false,
  }

  await api
    .post('/api/todos')
    .send(newTodo)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.todosInDb()
  expect(response).toHaveLength(helper.initialTodos.length + 1)

  const names = response.map(r => r.name)
  expect(names).toContain('Try adding a todo (async/await)')

})

// Test for checking if Todo with no name is added
test('Todo without name is not added', async () => {
  const newTodo = {
    completed: false
  }

  await api
    .post('/api/todos')
    .send(newTodo)
    .expect(400)

  const todosAtEnd = await helper.todosInDb()

  expect(todosAtEnd).toHaveLength(helper.initialTodos.length)
})

// Test to get a specific todo
test('a specific todo can be viewed', async () => {
  /* const todos = await Todo.find({})

  const todosJSON = todos.map(todo => todo.toJSON()) */

  const todos = await helper.todosInDb()

  const todoToView = todos[0]

  const resultTodo = await api
    .get(`/api/todos/${todoToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  expect(resultTodo.body).toEqual(todoToView)
})

// Test for deleting a todo
test('a todo can be deleted', async () => {
  /* const todos = await Todo.find({})
  const todosJSON = todos.map(todo => todo.toJSON()) */

  const todos = await helper.todosInDb()

  const todoToDelete = todos[0]

  await api
    .delete(`/api/todos/${todoToDelete.id}`)
    .expect(204)

  const newTodos = await Todo.find({})
  const newTodosJSON = newTodos.map(todo => todo.toJSON())

  expect(newTodosJSON).toHaveLength(helper.initialTodos.length - 1)

  const names = newTodosJSON.map(r => r.name)

  expect(names).not.toContain(todoToDelete.name)
})

// Test for updating a todo
test('a todo can be updated', async () => {
  /* const todos = await Todo.find({})
  const todosJSON = todos.map(todo => todo.toJSON()) */

  const todos = await helper.todosInDb()

  const todoToUpdate = todos[0]
  todoToUpdate.name = 'Name field has been updated'

  await api
    .put(`/api/todos/${todoToUpdate.id}`)
    .send(todoToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newTodos = await Todo.find({})
    const names = newTodos.map(r => r.name)

    expect(names).toContain('Name field has been updated')
})

// Closes connection to MongoDB after tests are run
afterAll(async () => {
  await mongoose.connection.close()
})