const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
// const logger = require('../utils/logger')

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

    expect(response.body).toHaveLength(helper.allBlogs.length)
  })

  test('all blogs returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.allBlogs.length)
  })

  test('check property id', async () => {
    const response = await api.get('/api/blogs')
    const getBlog = response.body[0]

    console.log({ response, getBlog })

    expect(getBlog.id).toBeDefined()
  })

  test('new blog add', async () => {
    const newBlog = {
      title: 'CSS is awesome',
      author: 'Luis Sanchez',
      url: 'luissresources.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsToEnd = await helper.blogsInDb()

    expect(blogsToEnd).toHaveLength(helper.allBlogs.length + 1)

    const contents = blogsToEnd.map( blog => blog.title)
    expect(contents).toContain('CSS is awesome')
  })

  test('send without likes property', async () => {
    const newBlog = {
      title: 'REACT is awesome',
      author: 'Luis Sanchez',
      url: 'luissresources.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const content = await helper.blogsInDb()
    console.log({ content })
    const lastBlog = content[content.length - 1]
    expect(lastBlog.likes).toBe(0)
  })

  test('send without title any url properties', async () => {
    const newBlog = {
      author: 'Luis Sanchez'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const content = await helper.blogsInDb()
    expect(content).toHaveLength(helper.allBlogs.length)
  })
})

describe('delete blog', () => {
  test('delete only blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.allBlogs.length - 1)
  })

  test('error id not found', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    const id = blogToDelete.id

    await Blog.findByIdAndRemove(id)

    await api
      .delete(`/api/blogs/${id}`)
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})