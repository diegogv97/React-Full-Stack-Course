const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')


const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs are identified by id property', async () => {
    const response = await api.get('/api/blogs')

    // by default, database names the property `_id`
    assert(response.body.every(e => e.id !== undefined))
  })

  describe('viewing a specific blog', () => {
    test('succeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]


      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })


  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'This is a new blog',
        author: 'Diego G',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 1000,
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      assert(response.body.title.includes('This is a new blog'))
    })

    test('likes count are default to 0 if not provided', async () => {
      const newBlog = {
        title: 'This is a new blog',
        author: 'Diego G',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('verifies that title is required when creating a new blog', async () => {
      const newBlog = {
        author: 'Diego G',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 100
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      assert.strictEqual(response.body.error, 'title or url missing')
    })


    test('verifies that url is required when creating a new blog', async () => {
      const newBlog = {
        title: 'This is a new blog',
        author: 'Diego G',
        likes: 100
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      assert.strictEqual(response.body.error, 'title or url missing')
    })

  })

  describe('deletion of a blog', () => {
    test('succeeds with 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating of a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes = 1001

      const response =  await api
        .put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
        .expect(200)

      assert.strictEqual(response.body.likes, 1001)
    })

    test('fails with 400 if required fields are missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`).send({ author: 'New Author' })
        .expect(400)
    })

    test('fails with 404 if blog is not found', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const validNonexistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${validNonexistingId}`).send(blogToUpdate)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})