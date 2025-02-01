const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');
const { validateUserCreation, validateUserUpdate } = require('../utils/validator');
const { hashPassword } = require('../utils/hashPassword');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

// All routes require authentication
router.use(authenticateToken);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authorizeRoles(['admin']), validateUserCreation, hashPassword, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user (Admin only)
 *     description: |
 *       You can update any of the user attributes (name, email, role, or password). 
 *       If you wish to only update a specific field, only provide the field you want to update in the request body.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.put('/:id', authorizeRoles(['admin']), validateUserUpdate, hashPassword, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', authorizeRoles(['admin']), userController.deleteUser);

module.exports = router;
