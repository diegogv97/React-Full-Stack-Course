import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let mockCreateBlog
  let user

  beforeEach(() => {
    mockCreateBlog = vi.fn()
    user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)
  })

  test('calls createBlog with the right details when a new blog is created', async () => {
    await user.type(screen.getByLabelText('title:'), 'Testing forms with vitest')
    await user.type(screen.getByLabelText('author:'), 'Test Author')
    await user.type(screen.getByLabelText('url:'), 'http://example.com/forms')
    await user.click(screen.getByText('add'))

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({
      title: 'Testing forms with vitest',
      author: 'Test Author',
      url: 'http://example.com/forms',
      likes: 0
    })
  })
})
