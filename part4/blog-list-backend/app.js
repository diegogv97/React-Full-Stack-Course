const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

const app = express()


mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

logger.info('connecting to', url)
mongoose
  .connect(url, { family: 4 })

  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })



app.use(express.static('dist'))
app.use(express.json())


app.use('/api/blogs', blogsRouter)

module.exports = app