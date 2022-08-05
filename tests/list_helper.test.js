const listHelper = require('../utils/list_helper')

describe('Dummy', () => {
  test('default returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

const emptyList = []

const listWithOneBlog = [
  {
    _id: '62ec5b2a841a969389e7bbd1',
    title: 'How Props Work in React - A Beginner Guide',
    author: 'Oyedele Temitope',
    url: 'https://www.freecodecamp.org/news/beginners-guide-to-props-in-react/',
    likes: 5,
    __v: 0
  }
]

const blogs = [
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
    author: 'Joel Olawanle',
    url: 'https://www.freecodecamp.org/news/how-to-change-text-size-in-html/',
    likes: 0,
    __v: 0
  }
]

describe('Total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('total likes of all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(39)
  })
})

describe('Favorite Blog', () => {
  test('find favorite blogs in empty list',() => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBe('none')
  })

  test('find favorite blog in a single item list', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const expectObject = {
      title: listWithOneBlog[0].title,
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes
    }
    expect(result).toEqual(expectObject)
  })

  test('find favorite blog in a list', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: blogs[3].title,
      author: blogs[3].author,
      likes: blogs[3].likes
    })
  })
})