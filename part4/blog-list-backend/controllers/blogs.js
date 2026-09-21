const blogsRouter = require('express').Router()
const middleware = require('../middlewares/middleware')

const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  if(!title || !url) {
    return response.status(400).json({
      error: 'title or url missing',
    })
  }

  const { user } = request
  const blog = new Blog({ title, author, url, likes, user: user._id })
  blog.likes = blog.likes ?? 0

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()


  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    return response.json(blog)
  }

  return response.status(404).end()
})


blogsRouter.delete('/:id',  middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const { user } = request

  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })
  if (!blog) {
    return response.status(404).end()
  }

  if(blog.user._id.toString() !== user.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(id)
  if (!deletedBlog) {
    return response.status(404).end()
  }

  return response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
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