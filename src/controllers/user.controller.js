const userService = require('../services/user.service');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

async function createUser(req, res, next) {
  try {
    const userData = req.body;
    const id = await userService.createUser(userData);
    res.status(201).json({ message: 'User created', id });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const affectedRows = await userService.updateUser(id, updatedData);
    if (affectedRows === 0) {
      throw new NotFoundError('User not found');
    }
    res.json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const affectedRows = await userService.deleteUser(id);
    if (affectedRows === 0) {
      throw new NotFoundError('User not found');
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
