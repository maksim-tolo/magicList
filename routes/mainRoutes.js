var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', isLoggedIn, function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/css/background', function(req, res) {
    res.sendfile('./public/img/background.jpg');
});

router.post('/signup', passport.authenticate('local-signup'),
    function(req, res) {
        res.send(req.user);
    });

router.post('/signin', passport.authenticate('local-login'),
    function(req, res) {
        res.send(req.user);
    });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.send('not logged');
}

module.exports = router;