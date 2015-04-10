var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
    res.send(req.user);
});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.send(req.user);
});

router.post('/upload', function(req, res) {
});

module.exports = router;