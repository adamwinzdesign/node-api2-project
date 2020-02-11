const express = require('express');

const blogPostsRouter = require('../blogPosts/blogPosts-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(
    `<h1>Welcome to the posts/comments API!</h1>`
  )
});

server.use('/api/posts', blogPostsRouter);

module.exports = server; 
