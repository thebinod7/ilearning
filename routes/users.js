const express = require('express');
const  router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');
const Users = require('../models/users');
const auth = require('../utils/auth').auth;
const multer  = require('multer');

var storage = multer.diskStorage({
  destination: './public/assets/img/uploads/',
  filename (req, file, cb) {
    cb(null,
      file.fieldname + '-' + Date.now() + '.' +
      file.originalname.split('.')[file.originalname.split('.').length - 1]
    );
  }
});

const upload = multer({ storage });

router.post('/uploadImg', upload.single('file'), function(req, res) {
  res.json({
    error: false,
    result: req.file.filename
  });
});

var sendEmail = function (dest,name,uniqueId,purpose) {
  var content,sub;
  if(purpose === 'signup') {
    sub = 'User registration ✔';
    content = '<b>Congratulations '+ name +', you have been registered to LMS.</b><br><a href="http://localhost:7979/courses/listings">Learn Something New today!</a>' // html body
  } else if(purpose === 'forgotPass') {
    sub = 'Forgot Password Recovery ✔';
    content = '<b>Hi '+ name +', you have made a request to recover password.</b><br><a href="http://localhost:7979/users/forgot/'+ uniqueId +'">Click here to reset your password</a>' // html body
  }
  else {
    sub = 'Check Email✔';
    content === 'No purpose sent!'
  }
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'binod@rumsan.com',
            pass: 'T$mp1234'
        }
    });

// setup email data with unicode symbols
    var mailOptions = {
        from: 'binod@rumsan.com', // sender address
        to: dest, // list of receivers
        subject: sub, // Subject line
       // text: message, // plain text body
        html: content
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions,function () {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent successfully!');
      //  console.log('Message %s sent: %s', info.messageId, info.response);
    })
}

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/dashboard', auth, function (req,res) {
  Users.findById(req.session.userId, function(err, doc) {
    if(err){
        res.json({success : false, msg : 'User not found!'});
    } else {
      const data = Object.assign(dashboardLayoutData, {
            title:  'User - Dashboard',
            user: doc
          });
          res.render('users/dashboard', data);
    }
});
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

router.post('/signup',function (req,res) {
    console.log(req.body);
    const payload = Object.assign({}, req.body, {
    });
    const newUser = new Users(payload);
    Users.getUserByEmail(newUser.email,function (err,userEmail) {
        if(err) throw err;
        if(userEmail){
          req.flash('error', 'Email already exits. Try new one or goto login!');
          res.redirect('/users/signup');
          return;
        }
        else {
            Users.addUser(newUser,function (err,doc) {
                if(err){
                  req.flash('error', 'Oops Something went wrong! Please try again');
                  res.redirect('/users/signup');
                } else {
                    sendEmail(doc.email,doc.firstName,doc._id,'signup');
                    req.flash('success', 'Congratulations, Your account has been successfully created. Please Login to continue!');
                    res.redirect('/users/login');
                }
            })
        }
    });
});

router.post('/login',function (req,res) {
    var users = new Users({
        email : req.body.email,
        password : req.body.password
    });
    Users.getUserByEmail(users.email, function (err, doc) {
        if(err) throw err;
        if(!doc){
            req.flash('error', 'Email not registered!');
            res.redirect('/users/login');
            return;
          //  return res.json({msg:'User does not exists.'});
        }
        Users.comparePassword(users.password,doc.password,function (err,isMatch) {
            if(err) throw err;
            console.log(isMatch);
            if(isMatch){
              req.session.userId = doc._id;
              req.session.user = doc;
              req.session.loggedIn = true;
              res.redirect('/users/dashboard');
            }
            else {
              req.flash('error', 'Wrong email or password!');
              res.redirect('/users/login');
            }
        });
    });
});

router.post('/update/:id',function (req,res) {
      const payload = Object.assign({}, req.body, {

      });
      Users.findOneAndUpdate({ _id: req.params.id }, { $set: payload }, (err) => {
        if(err) {
          req.flash('error', 'ERROR! Failed to update profile');
          res.redirect('/users/dashboard');
        }
        req.flash('success', 'SUCCESS! Profile updated successfully!');
        res.redirect('/users/dashboard');
      });
});

router.get('/logout', (req, res) => {
  req.session.userId = null;
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect('/users/login');
});

module.exports = router;
