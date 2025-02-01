const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env.config');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../utils/customErrors');

async function login(email, password) {
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials User Not Found');
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new UnauthorizedError('Invalid credentials Wrong Password');
  }  
  const token = jwt.sign({ id: user.id, role: user.role, passwordTimeStamp: user.passwordTimeStamp }, jwtSecret, { expiresIn: '1h' });
  return token;
}

module.exports = { login };
