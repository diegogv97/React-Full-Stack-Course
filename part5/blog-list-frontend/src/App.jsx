import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Toggable from './components/Toggable'
import blogService from './services/blogs'
import loginService from './services/login'

const loggedUserKey = 'loggedUser'

const sortBlogsByLikes = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const displayTempMessage = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( sortBlogsByLikes(blogs) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        loggedUserKey, JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
    } catch (error) {
      displayTempMessage(error, 'error')
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(blog))
      displayTempMessage(`a new blog ${blog.title} by ${blog.author} added`, 'success')
    } catch (error) {
      displayTempMessage(error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(loggedUserKey)
    setUser(null)
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const blog = await blogService.update(updatedBlog)
      const newBlogs = blogs.map(b => b.id === blog.id ? blog : b)
      setBlogs(sortBlogsByLikes(newBlogs))
      displayTempMessage(`blog ${blog.title} updated`, 'success')
    } catch (error) {
      displayTempMessage(error, 'error')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.deleteOne(blogToDelete.id)
      const newBlogs = blogs.filter(b => b.id !== blogToDelete.id)
      setBlogs(sortBlogsByLikes(newBlogs))
      displayTempMessage(`blog ${blogToDelete.title} deleted`, 'success')
    } catch (error) {
      displayTempMessage(error, 'error')
    }
  }

  if (user === null) {
    return (
      <>
        <Notification notification={notification} />
        <Toggable buttonLabel="Log In">
          <Login
            login={login}
          />
        </Toggable>
      </>
    )
  }

  return (
    <>
      <Notification notification={notification} />

      <div>
        <h2>{user.name} logged in</h2>
        <button onClick={handleLogout }>logout</button>
      </div>

      <br />

      <Toggable buttonLabel="create new blog" ref={blogFormRef} >
        <BlogForm
          createBlog={createBlog}
        />
      </Toggable>



      <br />
      <br />
      <br />

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
      )}
    </>
  )
}

export default App