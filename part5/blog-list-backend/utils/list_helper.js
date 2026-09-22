const _ = require('lodash')

const dummy = () => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let fav = blogs[0]
  for(const blog of blogs){
    if(blog.likes > fav.likes){
      fav = blog
    }
  }

  return fav
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogCountByAuthor = Object.entries(_.countBy(blogs, 'author')).map(([author, blogs]) => ({ author, blogs }))
  return _.maxBy(blogCountByAuthor, (entry) => entry.blogs)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = {}
  for(const blog of blogs){
    if(!likesByAuthor[blog.author]){
      likesByAuthor[blog.author] = blog.likes
      continue
    }

    likesByAuthor[blog.author] += blog.likes



  }

  const authorAndLikes = Object.entries(likesByAuthor).map(([author, likes]) => ({ author, likes }))


  return _.maxBy(authorAndLikes, (entry => entry.likes))
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}