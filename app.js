const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
var expressLayouts = require('express-ejs-layouts');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ilearning');

const users = require('./routes/users');
const courses = require('./routes/courses');
const admin = require('./routes/admin');

const app = express();

var port=Number(process.env.PORT || 7979);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret: 'helloworld12345678', resave:false, saveUninitialized:false, cookie: { maxAge: 60000000 }}));
app.use(flash());

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.loggedIn = req.session.loggedIn;
  next();
});

app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('layout extractScripts', true);

app.use(session({secret: 'helloworld12345678', resave:false, saveUninitialized:false, cookie: { maxAge: 60000000 }}));
//app.use(flash());

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// ROUTES FOR OUR API
app.use('/', require('./routes'));
app.use('/users', users);
app.use('/courses', courses);
app.use('/admin',admin);

app.use(express.static(path.join(__dirname,'public')));

//Start server
app.listen(port,function () {
    console.log('Server running at port:' + port);
});
