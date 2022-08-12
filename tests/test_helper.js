const Blog = require('../models/blog')

const allBlogs = [
  {
    _id: '62ec5b2a841a969389e7bbd1',
    title: 'How Props Work in React - A Beginner"s Guide',
    author: 'Oyedele Temitope',
    url: 'https://www.freecodecamp.org/news/beginners-guide-to-props-in-react/',
    likes: 5,
    __v: 0
  },
  {
    _id: '62ec5b2a841a969389e7bbd2',
    title: 'List Index Out of Range - Python Error [Solved]',
    author: 'Ihechikara Vincent Abba',
    url: 'https://www.freecodecamp.org/news/list-index-out-of-range-python-error-solved/',
    likes: 7,
    __v: 0
  },
  {
    _id: '62ec5b2a841a969389e7bbd3',
    title: 'Create a Blazor App with Syncfusion UI Components',
    author: 'Beau Carnes',
    url: 'https://www.freecodecamp.org/news/create-a-blazor-app-with-syncfusion-ui-components/',
    likes: 5,
    __v: 0
  },
  {
    _id: '62ec5b2a841a969389e7bbd4',
    title: 'How to Build a Real-time Chat App with React, Node, Socket.io, and HarperDB',
    author: 'Danny Adams',
    url: 'https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/',
    likes: 12,
    __v: 0
  },
  {
    _id: '62ec5b2a841a969389e7bbd5',
    title: 'How to Build a Redux-Powered React App',
    author: 'Soham De Roy',
    url: 'https://www.freecodecamp.org/news/how-to-build-a-redux-powered-react-app/',
    likes: 10,
    __v: 0
  },
  {
    _id: '62ec5b2a841a969389e7bbd6',
    title: 'HTML Font Size - How to Change Text Size with an HTML Tag',
    author: 'Oyedele Temitope',
    url: 'https://www.freecodecamp.org/news/how-to-change-text-size-in-html/',
    likes: 0,
    __v: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'test title', author: 'test author', url: 'test.com' })
  await blog.save()
  await blog.remove()
  //what's up?
  console.log(blog._id)
  return blog._id.toString()
}

module.exports = {
  allBlogs,
  blogsInDb,
  nonExistingId
}