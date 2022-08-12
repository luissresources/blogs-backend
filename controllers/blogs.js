const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  if(!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  const newObject = {
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes || 0
  }

  const blog = new Blog(newObject)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => console.log(error))
})

blogsRouter.delete('/:id', async (request, response) => {

  const objectToDelete = await Blog.findById(request.params.id)
  console.log({ objectToDelete })
  if(!objectToDelete) {
    response.status(404).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter