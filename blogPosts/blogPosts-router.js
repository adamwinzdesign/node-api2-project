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
  blogPosts.findById(req.params.id)
    .then(([post]) => {
      { post ? res.status(200).json(post) : res.status(404).json({ message: 'Post not found in blogPosts-router.js, get post by ID' })}
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

// delete post with given ID
router.delete('/:id', (req, res) => {
  blogPosts.remove(req.params.id)
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: 'Post deleted!' })
      } else {
        res.status(404).json({ message: 'Post could not be located.' })
      }
    })
    .catch(error => {
      res.status(500).json({ message: '** Server error removing the post **', error })
    })
});

// update post with put request
router.put('/:id', (req, res) => {
  const changes = req.body;
  blogPosts.update(req.params.id, changes)
    .then(post => {
      { post ? res.status(200).json(post) : res.status(404).json({ message: 'Post could not be found' })}
    })
    .catch(error => {
      res.status(500).json({ errorMessage: '** Server error updating the post **', error });
    })
});

// if post length === 0, send 404, else 200 with post
// get all comments from a single post
router.get('/:id/comments', (req, res) => {
  const id = req.params.id;
  blogPosts.findPostComments(id)
    .then(post => {
      if(post.length === 0) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        res.status(200).json(post)
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error, could not get comments', error })
    })
})

// submit new comment
router.post('/:id/comments', (req, res) => {
  const post_id = req.params.id;
  const {text} = req.body;

  blogPosts.findById(post_id)
    .first()
    .then(post => {
      if(!post) {
        res.status(400).json({ message: 'Could not locate a post with that ID' });
      } else if(!text) {
        res.status(400).json({ message: 'Please include text for your comment!' })
      } else {
        const newComment = { text, post_id }
        blogPosts.insertComment(newComment)
          .then(comment => {
            res.status(200).json({ message: 'Comment added!' })
          })
          .catch(error => {
            res.status(500).json({ errorMessage: 'Server error adding comment', error })
          })
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error getting post prior to inserting comment', error })
    })
})

module.exports = router;
