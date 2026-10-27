const { test, expect } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Diego G',
        username: 'diegog',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Log In' }).click()

    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, { username: 'diegog', password: 'salainen' })

      await expect(page.getByText('Diego G logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, { username: 'diegog', password: 'wrong' })

      await expect(page.locator('.notification.error')).toBeVisible()
      await expect(page.getByText('Diego G logged in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, { username: 'diegog', password: 'salainen' })
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'a blog created by playwright',
        author: 'Playwright',
        url: 'http://example.com/playwright'
      })

      await expect(
        page.getByText('a new blog a blog created by playwright by Playwright added')
      ).toBeVisible()
      await expect(
        page.getByText('a blog created by playwright Playwright').first()
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'a blog to like',
        author: 'Playwright',
        url: 'http://example.com/like'
      })
      await expect(page.getByText('a blog to like Playwright').first()).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('Likes: 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await createBlog(page, {
        title: 'a blog to delete',
        author: 'Playwright',
        url: 'http://example.com/delete'
      })
      await expect(page.getByText('a blog to delete Playwright').first()).toBeVisible()

      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Remove blog a blog to delete by Playwright?')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('a blog to delete Playwright')).toHaveCount(0)
    })

    test('only the user who added a blog sees its delete button', async ({ page, request }) => {
      await createBlog(page, {
        title: 'a blog with an owner',
        author: 'Playwright',
        url: 'http://example.com/owner'
      })
      await expect(page.getByText('a blog with an owner Playwright').first()).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3001/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'salainen'
        }
      })
      await loginWith(page, { username: 'otheruser', password: 'salainen' })

      await expect(page.getByText('Other User logged in')).toBeVisible()
      await expect(page.getByText('a blog with an owner Playwright').first()).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      test.setTimeout(15000)

      const titles = ['blog with fewest likes', 'blog with most likes', 'blog with some likes']
      for (const title of titles) {
        await createBlog(page, { title, author: 'Playwright', url: 'http://example.com/order' })
        await expect(page.getByText(`${title} Playwright`).first()).toBeVisible()
      }

      // each blog is a div with a direct "remove" button child
      const blogs = page.locator('xpath=//div[button[normalize-space()="remove"]]')
      const blogWithTitle = title =>
        page.locator(`xpath=//div[button[normalize-space()="remove"]][.//span[contains(., "${title}")]]`)

      const like = async (title, times) => {
        const blog = blogWithTitle(title)
        await blog.getByRole('button', { name: 'view' }).click()
        for (let i = 1; i <= times; i++) {
          await blog.getByRole('button', { name: 'like' }).click()
          await expect(blog.getByText(`Likes: ${i}`)).toBeVisible()
        }
      }

      await like('blog with most likes', 2)
      await like('blog with some likes', 1)

      await expect(blogs).toContainText([
        'blog with most likes',
        'blog with some likes',
        'blog with fewest likes'
      ])
    })
  })
})
