const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = [
    {
      username: 'root',
      password: process.env.SECRET
    },
    {
      username: 'luissdev',
      password: 'letsgo'
    }
  ]

  for(let user of users) {
    let passwordHash = await bcrypt.hash(user.password, 10)
    let userObject = new User ({
      username: user.username,
      passwordHash
    })
    await userObject.save()
  }

  const createToken = async () => {
    const userToUse = await  User.findOne({ username : 'luissdev' })
    token =  await helper.generateToken(userToUse)
  }

  createToken()
})

beforeEach(async () => {

  const user = await  User.findOne({ username : 'luissdev' })
  const userId = user._id.toString()
  const allBlogs = helper.allBlogs
  const allBlogsWithNewUser = allBlogs.map(blog => ({ ...blog, user: userId }))

  for(let blog of allBlogsWithNewUser) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('users', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'family',
      name: 'Family SE',
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
      username: 'johndoe',
      name: 'John Doe',
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

describe('blogs - get', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
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

  test('new blog add', async () => {
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
      .set({ Authorization : token })
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

describe('blogs - put', () => {
  test('update only blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes : 23 }

    await api
      .put(`/api/blogs/${ blogToUpdate.id }`)
      .send(updatedBlog)
      .set({ Authorization : token })

    const content = await Blog.findById(blogToUpdate.id)
    expect(content.likes).toBe(23)
  })
})

describe('blogs - delete', () => {
  test('delete only blog', async () => {
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
      .set({ Authorization: token })
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})