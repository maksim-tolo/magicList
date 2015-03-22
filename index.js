var express = require('express');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');     //logger
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 3000;

//var routes = require('./controllers/index')(passport);
//var users = require('./controllers/users')(passport);

var database = require('./config/database.js');     //load the config

mongoose.connect(database.url);     // connect to mongoDB database

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middlewares, которые должны быть определены до passport:
app.use(cookieParser());
//app.use(bodyParser());
app.use(session({ secret: 'SecretMagiclist' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
app.use(flash());

// Initialize Passport
//var initPassport = require('./controllers/passport/init');
//initPassport(passport);

require('./controllers/routes.js')(app, passport);

app.listen(port);
console.log("App listening on port " + port);