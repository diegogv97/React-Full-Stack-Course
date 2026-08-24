const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)

})

blogsRouter.post('/',async (request, response) => {
  const { title, url } = request.body
  if(!title || !url) {
    return response.status(400).json({
      error: 'title or url missing',
    })
  }

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

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { title, author, url, likes  } = request.body


  if (!title || !url) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  let blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).end()
  }

  Object.assign(blog, { title, author, url, likes })

  const updatedBlog = await blog.save({ runValidators: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter