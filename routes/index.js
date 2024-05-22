const express = require('express');
const catalogueController = require('../controllers/catalogueController');
const usersRouter = require('./users');
const catalogueRouter = require('./catalogue');
const passport = require('passport');

const router = express.Router();

//  routes
router.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Redirect to home or another route after successful login
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// example
router.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('This is a protected route');
});

router.use('/users', ensureAuthenticated, usersRouter);
router.use('/catalogue', catalogueRouter);

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

module.exports = {
  router,
  ensureAuthenticated,
};
