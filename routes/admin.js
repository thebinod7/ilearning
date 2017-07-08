const express = require('express');
const  router = express.Router();
const session = require('express-session');

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/users',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'Users List - Dashboard'
      });
      res.render('admin/userList', data);
});

module.exports = router;
