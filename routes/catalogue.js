const express = require('express');
const catalogueController = require('../controllers/catalogueController');

const router = express.Router();

// Define routes for catalogue operations
router.get('/', catalogueController.getAllBooks);
router.get('/:id', catalogueController.getSingleBook);
router.post('/', catalogueController.createBook);
router.put('/:id', catalogueController.updateBook);
router.delete('/:id', catalogueController.deleteBook);

module.exports = router;
