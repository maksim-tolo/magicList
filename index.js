var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 8080;

var users = require('./controllers/users')

mongoose.connect('mongodb://localhost:27017/test');

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.json());

// Middlewares, которые должны быть определены до passport:
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET' }));
 
// Passport:
app.use(passport.initialize());
app.use(passport.session());

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