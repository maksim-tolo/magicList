var express = require('express');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');     //logger
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 3000;

var routes = require('./controllers/index');
//var users = require('./controllers/users')
var database = require('./config/database');     //load the config

mongoose.connect(database.url);     // connect to mongoDB database

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));

// Middlewares, которые должны быть определены до passport:
app.use(cookieParser());
//app.use(express.session({ secret: 'SECRET' }));
 
// Passport:
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, function(username, password, done){
	User.findOne({ username : username},function(err,user){
		return err 
		? done(err)
		: user
		? password === user.password
		? done(null, user)
		: done(null, false, { message: 'Incorrect password.' })
		: done(null, false, { message: 'Incorrect username.' });
	});
}));

app.listen(port);
console.log("App listening on port " + port);