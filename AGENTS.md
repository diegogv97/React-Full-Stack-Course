# Repository Notes

## Running Backend Tests

The backend projects use Node's built-in test runner.

From the relevant backend directory, for example `part4/blog-list-backend`:

```bash
npm test
```

Run all tests in one test file:

```bash
npm test -- tests/blog_api.test.js
```

Run a specific test by matching its name:

```bash
npm test -- --test-name-pattern="blogs are returned as json"
```

Run a `describe` block by matching its description:

```bash
npm test -- --test-name-pattern="addition of a new blog"
```

The `--` separates npm arguments from Node's test-runner arguments.
