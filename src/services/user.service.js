const redisClient = require('../config/redis.config');
const userModel = require('../models/user.model');

const CACHE_TTL = 60;

async function createUser(userData) {
  const userId = await userModel.createUser(userData);
  await redisClient.del('users:all');
  return userId;
}

async function getAllUsers() {
  const cachedUsers = await redisClient.get('users:all');
  if (cachedUsers) {
    return JSON.parse(cachedUsers);
  }

  const users = await userModel.getAllUsers();
  await redisClient.setEx('users:all', CACHE_TTL, JSON.stringify(users));
  return users;
}

async function getUserById(id) {
  const cacheKey = `users:${id}`;
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await userModel.getUserById(id);
  if (user) {
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(user));
  }
  return user;
}

async function updateUser(id, userData) {
  const affectedRows = await userModel.updateUser(id, userData);
  await redisClient.del('users:all');
  await redisClient.del(`users:${id}`);
  return affectedRows;
}

async function deleteUser(id) {
  const affectedRows = await userModel.deleteUser(id);
  await redisClient.del('users:all');
  await redisClient.del(`users:${id}`);
  return affectedRows;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
