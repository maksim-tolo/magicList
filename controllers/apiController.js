var User = require('../models/user');
var List = require('../models/list');
var apiController = {};

apiController.checkEmail = function (req, res) {
	User.findOne({ 'email': req.body.email }, function(err, user) {
		if (err) return console.error(err);
		if (!user) res.end();
		else res.send('exist');
	});
};

apiController.createList = function (req, res) {
	var newList = new List();
	newList.listName = req.body.listName;
	newList.owner = req.body.ownerId;
	newList.members.push(req.body.ownerId);
	newList.save(function(err){
		if (err) return console.error(err);
	});
    User.findByIdAndUpdate(req.body.ownerId, { $push: {'lists': newList._id} }, function(err){
        if (err) return console.error(err);
    });
    res.send(newList);
};

apiController.createTask = function (req, res) {
	List.findByIdAndUpdate(req.body.listId, { $push: {'tasks': { 'taskName': req.body.taskName, 'complited': false } } }, function(err, list){
        if (err) return console.error(err);
        res.send(list.tasks[list.tasks.length-1]);
    });
};

apiController.changeListName = function (req, res) {
	List.findByIdAndUpdate(req.body.listId, { listName: req.body.listName }, function(err, list){
        if (err) return console.error(err);
        res.end();
    });
};

apiController.removeList = function (req, res) {
	List.findById(req.body.listId, function(err, list) {
        for (var i = 0; i < list.members.length; i++) {
            User.findByIdAndUpdate(list.members[i], { $pull: { 'lists': req.body.listId } }, function(err, list){
                if (err) return console.error(err);
            });
        }
    });

    List.findByIdAndRemove(req.body.listId, function(err, list){
        if (err) return console.error(err);
        res.end();
    });
};

apiController.changeTaskStatus = function (req, res) {
	var previousValue;

    List.findOne({ 'tasks._id': req.body.taskId }, function(err, list) {
        if (err) return console.error(err);
        console.log(list);
    });

    List.update({ 'tasks._id': req.body.taskId }, {'$set': { 'tasks.$.complited': !previousValue }}, function(err) {
        if (err) return console.error(err);
    });
    res.end();
        //.update({ 'tasks[req.body.taskIndex].complited': !previousValue });
};

module.exports = apiController;