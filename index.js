var express = require('express');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');     //logger
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 3000;

var routes = require('./controllers/index')(passport);
var users = require('./controllers/users')(passport);

var database = require('./config/database');     //load the config

mongoose.connect(database.url);     // connect to mongoDB database

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middlewares, которые должны быть определены до passport:
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}))

// Passport:
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./controllers/passport/init');
initPassport(passport);

app.use('/', routes);
app.use('/users', users);

app.listen(port);
console.log("App listening on port " + port);