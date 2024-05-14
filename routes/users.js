const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

// Define routes for user operations
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getSingleUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
