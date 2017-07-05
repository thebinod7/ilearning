const express = require('express');
const  router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/dashboard',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('users/dashboard', data);
});

router.get('/learning',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Courses - learning'
      });
      res.render('users/learning', data);
});

router.get('/teaching',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Courses - teaching'
      });
      res.render('users/teaching', data);
});

router.get('/signup',function (req,res) {
    data = {
        title: 'Signup - LMS'
    },
        res.render('users/signup',data);
});

router.get('/login',function (req,res) {
    data = {
        title: 'Login - LMS'
    },
        res.render('users/login',data);
});

router.get('/logout', (req, res) => {
  req.session.userId = null;
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect('/users/login');
});

module.exports = router;
