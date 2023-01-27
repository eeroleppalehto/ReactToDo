const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://eerontodo:${password}@cluster0.qorjrd4.mongodb.net/todoApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const todoSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  created: String,
})

const Todo = mongoose.model('Todo', todoSchema)

/* const todo = new Todo({
  name: "Make db connection",
  completed: false,
  created: new Date().toJSON(),
})

todo.save().then(result => {
  console.log('todo saved!')
  mongoose.connection.close()
}) */

Todo.find({}).then(result => {
  result.forEach(todo => {
    console.log(todo)
  })
  mongoose.connection.close()
})