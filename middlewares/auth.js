const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization) {
    return res
      .status(401)
      .send({ valid: false, message: 'Access denied. No token provided.' });
  }

  const token = authorization.replace('Bearer ', '');
  if (!token) {
    return res
      .status(401)
      .send({ valid: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
    if (!req.user) {
      return res
        .status(401)
        .send({ valid: false, message: 'Access denied. Invalid token.' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ valid: false, message: 'Invalid token.' });
  }
};
