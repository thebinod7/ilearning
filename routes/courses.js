const express = require('express');
const  router = express.Router();
const session = require('express-session');

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/my',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'My Courses - Dashboard'
      });
      res.render('courses/myCourses', data);
});

router.get('/add',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Add Course - Dashboard'
      });
      res.render('courses/add', data);
});

router.get('/content',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Add Content - Dashboard'
      });
      res.render('courses/content', data);
});

router.get('/listings',function(req,res) {
  const data = {
    title : 'Course Listing'
  }
  res.render('courses/listings',data);
});

router.get('/details',function(req,res) {
  const data = {
    title : 'Course Details'
  }
  res.render('courses/details',data);
});

module.exports = router;
