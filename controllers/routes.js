var User = require('../models/user');
var List = require('../models/list');

module.exports = function(app, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.sendfile('./public/index.html');
    });

    app.post('/api/signup', passport.authenticate('local-signup'),
        function(req, res) {
            res.send(req.user);
    });

    app.post('/api/signin', passport.authenticate('local-login'),
        function(req, res) {
            res.send(req.user);
    });

    app.post('/api/checkEmail', function(req, res) {
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            
            if(!user) {
                res.send('notExist');
            } else {
                res.send('exist');
            }
        });
    });

    app.put('/api/createList', function(req, res) {

        var newList = new List();
        newList.listName = req.body.listName;
        newList.owner = req.body.ownerId;
        newList.members.push(req.body.ownerId);
        newList.save(function(err){
            if (err) return console.error(err);
            User.findByIdAndUpdate(req.body.ownerId, { $push: {'lists': newList._id} }, function(err){
                if (err) return console.error(err);
            });
            res.send(newList);
        });
    });

    app.put('/api/createTask', function(req, res) {

        List.findByIdAndUpdate(req.body.listId, { $push: {'tasks': { 'taskName': req.body.taskName, 'complited': false } } }, function(err, list){
            if (err) return console.error(err);
            res.send(list.tasks[list.tasks.length-1]);
        });

    });

    app.post('/api/changeListName', function(req, res) {

        List.findByIdAndUpdate(req.body.listId, { listName: req.body.listName }, function(err, list){
            if (err) return console.error(err);
            res.send("success");
        });

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