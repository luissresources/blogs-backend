const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.allBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(process.env.SECRET, 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'letsgo',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user create: username and password validation error ', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'luiss2',
      name: 'Luis Sanchez',
      password: 'le',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
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

    expect(getBlog.id).toBeDefined()
  })

  test.only('new blog add', async () => {
    const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1aXNzZGV2IiwiaWQiOiI2MmY5NTI2ZWIzNTk4NDgxYTM5NTQ5MzIiLCJpYXQiOjE2NjA1MjQ0NDJ9.yq_0J6tcYfbGcikoHlekEyAtRPhanJbeHZvJDeKGjxo'

    const userAll = await helper.usersInDb()
    const user = userAll[0]

    const newBlog = {
      title: 'CSS is awesome',
      author: 'Luis Sanchez',
      url: 'luissresources.com',
      likes: 11,
      user: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization : token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsToEnd = await helper.blogsInDb()

    expect(blogsToEnd).toHaveLength(helper.allBlogs.length + 1)

    const contents = blogsToEnd.map( blog => blog.title)
    expect(contents).toContain('CSS is awesome')
  })

  test('send without likes property', async () => {
    const userAll = await helper.usersInDb()
    const user = userAll[0]

    const newBlog = {
      title: 'REACT is awesome',
      author: 'Luis Sanchez',
      url: 'luissresources.com',
      user: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const content = await helper.blogsInDb()
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

describe('update blog', () => {
  test('update only blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { ...blogToUpdate, likes : 23 }

    await api
      .put(`/api/blogs/${ blogToUpdate.id }`)
      .send(updatedBlog)

    const content = await Blog.findById(blogToUpdate.id)
    expect(content.likes).toBe(23)
  })
})

describe('delete blog', () => {
  test('delete only blog', async () => {

    const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1aXNzZGV2IiwiaWQiOiI2MmY5NTI2ZWIzNTk4NDgxYTM5NTQ5MzIiLCJpYXQiOjE2NjA1MjQ0NDJ9.yq_0J6tcYfbGcikoHlekEyAtRPhanJbeHZvJDeKGjxo'


    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: token })
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