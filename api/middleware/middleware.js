const Users = require('../users/users-model')
function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log({
    requestMethod: req.method, 
    requestURL: req.originalUrl, 
    timeStamp: new Date().toLocaleString()});
    next();
};

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
 try {
  const user = await Users.getById(req.params.id)
  if (!user) {
    res.status(404).json({ message: 'user not found'})
  } else {
    req.user = user
    next()
  }
 } catch (error) {
  res.status(500).json({ message: 'problem finding user' })
 }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({message: 'missing required name'})
  } else {
    req.name = name.trim();
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    req.text = text.trim()
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}