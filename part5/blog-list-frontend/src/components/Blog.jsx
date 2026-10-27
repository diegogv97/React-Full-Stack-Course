import { useState  } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  const blockStyle = { paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  const showWhenVisible = { display: visible ? 'block' : 'none' }
  const isOwner = Boolean(currentUser) && blog.user?.username === currentUser.username

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blockStyle}>
      <div style={{ ...headerStyle, display: visible ? 'none' : 'flex' }}>
        <span>{blog.title} {blog.author}</span>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div style={headerStyle}>
          <span>{blog.title} {blog.author}</span>
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <p><strong>URL:</strong> {blog.url}</p>
        <div>
          <span><strong>Likes:</strong> {blog.likes}</span>
          <button onClick={handleLike}>like</button>
        </div>
        <p><strong>Added by:</strong> {blog.user?.name}</p>
      </div>

      {isOwner && (
        <button onClick={handleDelete} style={{ backgroundColor: 'blue', borderRadius: 5, padding: '8px 16px', fontSize: 16 }}>remove</button>
      )}
    </div>
  )
}

export default Blog
