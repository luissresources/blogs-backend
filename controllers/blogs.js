const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if(!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  // const user = await User.findById(body.userId)

  const newObject = {
    title: body.title,
    author: body.author,
    likes: body.likes || 0
  }

  const blog = new Blog(newObject)

  const savedBlog = await blog.save()

  // user.notes = user.notes.concat(savedBlog._id)
  // await user.save()

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

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const objectToDelete = await Blog.findById(request.params.id)
  if(!objectToDelete) {
    response.status(404).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter