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
    const userId = await Users.getById(req.params.id)
    if (userId) {
      req.userId = userId;
      next();
    } else {
      // next({status: 404, message: 'user not found'})
      res.status(404).json({message: 'user not found'})
    }
  } catch (error) {
    // next(error);
    res.status(500).json({message: 'problem finding user'});
  }

}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (
    name !== undefined &&
    typeof name === 'string' &&
    name.length &&
    name.trim().length
  ) {
    next();
  } else {
    // next({status: 400, message: 'missing required name field'});
    res.status(400).json({message: 'missing required name'});
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (
    text !== undefined &&
    typeof text === 'string' &&
    text.length &&
    text.trim().length
  ){
    next();
  } else {
    next({status: 400, message: 'missing required text field'})
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}