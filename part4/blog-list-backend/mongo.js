const mongoose = require('mongoose')



const url = ''
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)



const person = new Blog({      title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0 })

person.save().then(() => {
  mongoose.connection.close()
})