const express = require('express');
const catalogueController = require('../controllers/catalogueController');
const usersRouter = require('./users');
const catalogueRouter = require('./catalogue');

const router = express.Router();

//  routes
router.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

router.use('/users', usersRouter);
router.use('/catalogue', catalogueRouter);

// Export the router
module.exports = router;
