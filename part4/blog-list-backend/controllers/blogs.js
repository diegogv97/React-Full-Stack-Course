const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)

})

blogsRouter.post('/',async (request, response) => {
  const blog = new Blog(request.body)
  blog.likes = blog.likes ?? 0
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    return response.json(blog)
  }

  return response.status(404).end()
})


blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (!deletedBlog) {
    return response.status(404).end()
  }

  return response.status(204).end()
})

module.exports = blogsRouter