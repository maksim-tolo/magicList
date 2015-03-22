// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('*', isLoggedIn, function(req, res) {
        res.sendfile('./public/index.html'); // load the index.ejs file
    });

    app.get('/api/login', isLoggedIn, function(req, res) {
        res.send('logged');
    });

    app.post('/api/signup', passport.authenticate('local-signup'),
        function(req, res) {
       //successRedirect : '/profile', // redirect to the secure profile section
        //failureRedirect : '/signup', // redirect back to the signup page if there is an error
        //failureFlash : true // allow flash messages
        //failureFlash: 'Invalid username or password.',
        //successFlash: 'Welcome!'
        res.send(req.user);
    });

    app.post('/api/signin', passport.authenticate('local-login'),
        function(req, res) {
            res.send(req.user);
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.send('not logged');
}