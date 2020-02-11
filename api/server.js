const express = require('express');

const blogPostRouter = require('../blogPosts/blogPosts-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(
    `<h1>Welcome to the posts/comments API!</h1>`
  )
});

server.use('../blogPosts/blogPosts-router.js', blogPostRouter);

module.exports = server; 
