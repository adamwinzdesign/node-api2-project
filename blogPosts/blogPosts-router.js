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
// NEED TO CORRECT logic if post not found, currently returns 200 and empty array
router.get('/:id', (req, res) => {
  blogPosts.findById(req.params.id)
    .then(post => {
      {post ? res.status(200).json(post) : res.status(404).json({ message: 'Post not found in blogPosts-router.js, get post by ID' })}
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error getting post by ID in blogPosts-router.js '});
    })
});

// post new blog post
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if( !title || !contents ) {
    res.status(400).json({ message: 'Please provide a title and content for this post!' })
  } else {
    blogPosts.insert(req.body)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(error => {
        res.status(500).json({ errorMessage: 'Error making a new post in blogPosts-router.js, post to / ', error})
      })
  }
});

module.exports = router;
