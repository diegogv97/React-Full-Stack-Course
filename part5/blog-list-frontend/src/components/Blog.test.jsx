import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let mockUpdateBlog
  let user

  beforeEach(() => {
    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Test Author',
      url: 'http://example.com/blog',
      likes: 7,
      user: { name: 'Some User' }
    }

    mockUpdateBlog = vi.fn()
    user = userEvent.setup()

    render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={() => {}} />)
  })

  const clickButton = async (text) => {
    await user.click(screen.getByText(text))
  }

  test('renders title and author, but not url or likes by default', () => {
    // title and author are rendered twice (collapsed and expanded rows),
    // the first match is the collapsed row, which is the one shown by default
    const titleAndAuthor = screen.getAllByText(`${blog.title} ${blog.author}`)
    expect(titleAndAuthor[0]).toBeVisible()

    expect(screen.getByText(blog.url)).not.toBeVisible()
    expect(screen.getByText(blog.likes)).not.toBeVisible()
  })

  test('shows url and likes after clicking the view button', async () => {
    await clickButton('view')

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(blog.likes)).toBeVisible()
  })

  test('calls the updateBlog handler twice when the like button is clicked twice', async () => {
    await clickButton('view')

    await clickButton('like')
    await clickButton('like')

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
