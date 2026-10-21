import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  // for new blog
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)

  const handleSaveNewBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: likes
    }

    createBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes(0)
  }

  return (
    <form>
      <div>
        <label>
          title:{' '}
          <input
            value={title}
            type="text"
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:{' '}
          <input
            value={author}
            type="text"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:{' '}
          <input
            value={url}
            type="text"
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          likes:{' '}
          <input
            value={likes}
            type="number"
            onChange={({ target }) => setLikes(target.value)}
          />
        </label>
      </div>
      <div>
        <button type="submit" onClick={handleSaveNewBlog}>
          add
        </button>
      </div>
    </form>
  )
}

export default BlogForm
