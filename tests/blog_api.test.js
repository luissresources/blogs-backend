const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const logger = require('../utils/logger')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.allBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('all blogs - get', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')

    logger.info(response.body)

    expect(response.body).toHaveLength(helper.allBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})