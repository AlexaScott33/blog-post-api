'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Best post ever', 'cool stuff', 'Me');
BlogPosts.create('Worst post ever', 'bad stuff', 'You');
BlogPosts.create('Cat post', 'cat stuff', 'Someone');

//get all posts
router.get('/blog-posts', (req, res) => {
  console.log('making get request');
  res.json(BlogPosts.get());
});

//get post by id
router.get('/blog-posts/:id', (req, res) => {
  const {id} = req.params;

  res.json(BlogPosts.get(id));
});

//create new post
router.post('/blog-posts', jsonParser, (req, res, next) => {
  const {title, content, author} = req.body;

  //can loop instead
  if(!title) {
    const message = 'Missing `title` in request body';
    return res.status(400).send(message);
  }

  if(!content) {
    const message = 'Missing `content` in request body';
    return res.status(400).send(message);
  }

  if(!author) {
    const message = 'Missing `author` in request body';
    return res.status(400).send(message);
  }

  //this makes new title object ????
  //const newPost = {title, content, author};

  const result = BlogPosts.create(title, content, author);
  res.status(201).json(result);
});

//update post
router.put('/blog-posts/:id', jsonParser, (req, res) => {
  const {id} = req.params;
  const {title, content, author} = req.body;

  const requiredFields = ['id', 'title', 'content', 'author'];
  for(let i = 0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if(id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match)`;
    console.error(message);
    return res.status(400).send(message);
  }

  const updatedPost = {id, title, content, author}; 
  BlogPosts.update(updatedPost);
  res.status(204).end();
});

//delete post
router.delete('/blog-posts/:id', (req, res) => {
  const {id} = req.params;

  //why does this not work ??
  //   if(id !== req.body.id) {
  //     const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match)`;
  //     console.error(message);
  //     return res.status(400).send(message);
  //   }

  BlogPosts.delete(id);
  res.status(204).end();
});


module.exports = router;