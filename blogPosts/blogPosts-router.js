const express = require('express');

const blogPosts = require('../data/db');

const router = express.Router();

router.use(express.json());

// get all posts, localhost:5000/api/posts/
router.get('/', (req, res) => {
  blogPosts.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error getting blog posts in blogPosts-router.js, router.get /' });
    })
});

// get post by ID
router.get('/:id', (req, res) => {
  
})

module.exports = router;
