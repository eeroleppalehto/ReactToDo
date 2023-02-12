// Schema for storing Todos in MongoDB

const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  completed: Boolean,
  created: String,
})
  
// Changes the toJSON method to display id as string instead of the default object and not to display v at all.
todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Todo', todoSchema)