const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, likes: 1, id: 1 } )
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(!(body.username && body.password)) {
    return response.status(400).send({
      error: 'Added username and password'
    })
  }

  if(body.username.length < 3 && body.password.length < 3) {
    return response.status(400).send({
      error: 'username and password must be greater than three characters'
    })
  }

  if(body.username.length < 3) {
    return response.status(400).send({
      error: 'username must be greater than three characters'
    })
  }

  if(body.password.length < 3) {
    return response.status(400).send({
      error: 'password must be greater than three characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name || 'user',
    password: passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter