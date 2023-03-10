// The actual application to be run

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const todosRouter = require('./controllers/todos')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app.use('/api/todos', todosRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app