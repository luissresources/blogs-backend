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

const mostBlogs = blogs => {
  const resultsObject = {}
  let mostValue = 0
  let mostAuthor = 0
  let resultsMostAuthor = {}
  if (blogs.length !== 0){
    blogs.map(blog => {
      const author = blog.author
      if (!resultsObject.hasOwnProperty(author)){
        resultsObject[author] = 1
      } else {
        resultsObject[author] += 1
      }
    })

    // iterando objecto de resultados
    Object.entries(resultsObject).forEach(([key, value]) => {
      if (value > mostValue){
        mostValue = value
        mostAuthor = key
      }
    })
    return resultsMostAuthor = {
      author: mostAuthor,
      blogs: mostValue
    }
  }
  return 'empty'
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}