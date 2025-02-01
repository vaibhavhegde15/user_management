const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env.config');
const { UnauthorizedError } = require('../utils/customErrors');
const userModel = require('../models/user.model');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Access token missing'));
  }

  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) {
      return next(new UnauthorizedError('Invalid access token'));
    }
    const passwordTimeStamp = new Date((await userModel.getPasswordTimeStampById(user.id)).passwordTimeStamp);
    const jwtPasswordTimeStamp = new Date(user.passwordTimeStamp);
    if (jwtPasswordTimeStamp.toISOString() !== passwordTimeStamp.toISOString()) {
      return next(new UnauthorizedError('Token Expired'));
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
