var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/css/background', function(req, res) {
    res.sendfile('./public/img/background.jpg');
});

router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
    res.send(req.user);
});

router.post('/signin', passport.authenticate('local-login'), function(req, res) {
    res.send(req.user);
});

module.exports = router;