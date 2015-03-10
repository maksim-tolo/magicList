var express = require('express');
var users = express.Router();

// Auth system
users.post('/login', controllers.users.login);
users.post('/register', controllers.users.register);
users.get('/logout', controllers.users.logout);

module.exports = users;