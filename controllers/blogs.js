const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  let user = ''

  if(!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  user = await User.findById(decodedToken.id)

  const newObject = {
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
    user: user.id
  }

  const blog = new Blog(newObject)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  let user = ''

  if(!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  user = await User.findById(decodedToken.id)

  const blogWithoutUpdate = await Blog.findById(request.params.id)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if( user._id.toString() !== blogWithoutUpdate.user.toString()) {
    return response.status(401).end()
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blogToDelete = await Blog.findById(request.params.id)

  if(!blogToDelete) {
    return response.status(404).end()
  }

  const userOwnToBlog = blogToDelete.user.toString()

  if( user.id !== userOwnToBlog) {
    response.status(401).end()
  }

  await Blog.findByIdAndRemove(blogToDelete.id)
  response.status(204).end()
})

module.exports = blogsRouter