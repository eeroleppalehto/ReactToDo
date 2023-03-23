const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Todo = require('../models/todo')

describe('when there is initially some todos saved', () => {
  // Initializes test database before tests
  beforeEach(async () => {
    await Todo.deleteMany({})
    await Todo.insertMany(helper.initialTodos)
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

  describe('addition of new todo', () => {
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
  })

  describe('viewing a specific todo', () => {
    // Test to get a specific todo
    test('a specific todo can be viewed', async () => {
      const todos = await helper.todosInDb()

      const todoToView = todos[0]

      const resultTodo = await api
        .get(`/api/todos/${todoToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      expect(resultTodo.body).toEqual(todoToView)
    })

    test('fails with status code 404 if todo does not exist', async () =>{
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/todos/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/todos/${invalidId}`)
        .expect(400)
    })
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
})


// Closes connection to MongoDB after tests are run
afterAll(async () => {
  await mongoose.connection.close()
})