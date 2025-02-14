const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// The middleware functions also need to be required
const { 
  logger, 
  validateUserId, 
  validateUser, 
  validatePost } = require('../middleware/middleware');

const router = express.Router();

router.get('/', logger, (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
  })
    .catch(error => {
      next(error)
    })
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  Users.getById(req.params.id)
    .then(user => {
      res.json(user)
    })
    .catch(next)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert({ name: req.name })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, { name: req.name })
    .then( () => {
      return Users.getById(req.params.id)
    })
    .then(user => {
      res.json(user)
    })
    .catch(next);
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    // const deletedUser = await Users.getById(req.params.id)
    await Users.remove(req.params.id)
    res.json(req.user)
  } catch (error) {
    next(error)
  }
//   Users.remove(req.params.id)
//     .then( () => {
//       return Users.getById(req.params.id)
//     })
//     .then(user => {
//       res.json(user)
//     })
//     .catch()
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const result = await Users.getUserPosts(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const result = await Posts.insert({ user_id: req.params.id, text: req.text})
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: 'Something bad happened inside the users router',
    stack: error.stack
  });
});

// do not forget to export the router
module.exports = router