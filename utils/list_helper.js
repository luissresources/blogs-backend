// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let count = 0
  if (blogs.length !== 0) {
    blogs.forEach(blog => count += blog.likes)
    return count
  }
  return 0
}

const favoriteBlog = blogs => {
  let quantityLikes = 0
  let position = 0
  if (blogs.length !== 0) {
    blogs.forEach((blog, i) => {
      if(quantityLikes <= blog.likes) {
        quantityLikes = blog.likes
        position = i
      }
    })
    return {
      title: blogs[position].title,
      author: blogs[position].author,
      likes: blogs[position].likes
    }
  }
  return 'none'
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}