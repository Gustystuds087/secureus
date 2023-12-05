const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password, confirm } = req.body;
      if (password != confirm) {
        req.flash('error', "The passwords don't match");
        return res.redirect('/register');
      }

      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to WeSAFE');
        res.redirect('/warrantys');
      });
    } catch (e) {
      req.flash('error', 'The Email/Username is already registered');
      res.redirect('/register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'Welcome Back!!!');
    res.redirect('/warrantys');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
module.exports = router;
