var express = require('express.io');
var app = express();
app.http().io();

var mongoose = require('mongoose');
var morgan = require('morgan');     //logger
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var apiRoutes = require('./routes/apiRoutes');
var mainRoutes = require('./routes/mainRoutes');

var port = process.env.PORT || 3000;

var database = require('./config/database.js');

mongoose.connect(database.url);

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'SecretMagiclist' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', mainRoutes);
app.use('/api', apiRoutes);

app.io.route('listRooms', function(req) {
	for (var i = 0; i < req.data.length; i++) req.io.join(req.data[i]);
});

app.io.route('userRooms', function(req) {
	req.io.join(req.data);
});

app.io.route('update', function(req) {
    req.io.room(req.data).broadcast('updateUser', {
    	message: 'update'
    });
});

app.listen(port);
console.log("App listening on port " + port);