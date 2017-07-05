const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var expressLayouts = require('express-ejs-layouts');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ilearning');

const users = require('./routes/users');

const app = express();

const port = 7979;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.use(express.static(path.join(__dirname,'public')));

//Start server
app.listen(port,function () {
    console.log('Server running at port:' + port);
});
