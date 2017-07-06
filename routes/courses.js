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
      res.render('Courses/myCourses', data);
});

router.get('/add',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Add Course - Dashboard'
      });
      res.render('Courses/add', data);
});

module.exports = router;
