var User = require('../models/user');
var List = require('../models/list');
var fs = require('fs');
var apiController = {};

apiController.getUser = function (req, res) {
    User.findById(req.body.userId)
    .populate('lists inbox')
    .exec(function(err, user) {
        if (err) return console.error(err);
        res.send(user);
    });
};

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
    newList.membersEmail.push(req.body.ownerEmail);
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
	List.findByIdAndUpdate(req.body.listId, { listName: req.body.listName }, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.removeList = function (req, res) {
	List.findById(req.body.listId, function(err, list) {

        for (var i = 0; i<list.tasks.length; i++) {
            for (var j = 0; j < list.tasks[i].attachments.length; j++) fs.unlink('./public/uploads/'+list.tasks[i].attachments[j].name, function(err){
                if (err) return console.error(err);
            });
        }
  
        for (var i = 0; i < list.membersEmail.length; i++) {
            User.update({ 'email': list.membersEmail[i] }, { $pull: { 'lists': req.body.listId, 'inbox': req.body.listId } }, function(err){
                if (err) return console.error(err);
            });
        }
    });

    List.findByIdAndRemove(req.body.listId, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.changeTaskStatus = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, {'$set': { 'tasks.$.complited': !req.body.currentTaskStatus }}, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.changeSubtask = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, { '$set': {'tasks.$.subtasks': req.body.subtasks } }, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.addListMember = function (req, res) {
    List.findByIdAndUpdate(req.body.listId, { $push: {'membersEmail': req.body.userEmail } }, function(err){
        if (err) return console.error(err);
    });
    User.update({ 'email': req.body.userEmail }, { $push: {'inbox': req.body.listId } }, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.confirmInboxList = function (req, res) {
    User.update({ 'email': req.body.userEmail }, { $pull: {'inbox': req.body.listId }, $push: {'lists': req.body.listId } }, function(err){
        if (err) return console.error(err);       
    });
    User.findOne({ 'email': req.body.userEmail }, function(err, user) {
        if (err) return console.error(err);
        List.findByIdAndUpdate(req.body.listId, { $push: {'members': user._id } }, function(err){
            if (err) return console.error(err);
        });
    });

    res.end();
};

apiController.rejectInboxList = function (req, res) {
    List.findByIdAndUpdate(req.body.listId, { $pull: {'membersEmail': req.body.userEmail } }, function(err){
        if (err) return console.error(err);
    });
    User.update({ 'email': req.body.userEmail }, { $pull: {'inbox': req.body.listId } }, function(err){
        if (err) return console.error(err);
    });

    res.end();
};

apiController.leaveList = function (req, res) {
    User.update({ 'email': req.body.userEmail }, { $pull: {'lists': req.body.listId } }, function(err){
        if (err) return console.error(err);      
    });
    User.findOne({ 'email': req.body.userEmail }, function(err, user) {
        if (err) return console.error(err);
        List.findByIdAndUpdate(req.body.listId, { $pull: {'membersEmail': req.body.userEmail, 'members': user._id } }, function(err){
            if (err) return console.error(err);
        });
    });

    res.end();
};

apiController.removeUserFromList = function (req, res) {
    User.update({ 'email': req.body.userEmail }, { $pull: {'lists': req.body.listId, 'inbox': req.body.listId } }, function(err){
        if (err) return console.error(err);      
    });
    User.findOne({ 'email': req.body.userEmail }, function(err, user) {
        if (err) return console.error(err);
        List.findByIdAndUpdate(req.body.listId, { $pull: {'membersEmail': req.body.userEmail, 'members': user._id } }, function(err){
            if (err) return console.error(err);
        });
        res.send(user._id);
    });    
};

apiController.updateDate = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, {'$set': { 'tasks.$.deadline': req.body.newDate }}, function(err){
        if (err) return console.error(err);
        res.end();
    });   
};

apiController.updateDescription = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, {'$set': { 'tasks.$.description': req.body.newDescription }}, function(err){
        if (err) return console.error(err);
        res.end();
    });   
};

apiController.createSubtask = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, { $push: {'tasks.$.subtasks': { 'subtaskName': req.body.subtaskName, 'complited': false } } }, function(err){
        if (err) return console.error(err);
    });
    List.findOne({ 'tasks._id': req.body.taskId }, function(err, list) {
        if (err) return console.error(err);
        res.send(list);
    });
};

apiController.addFileToTask = function (file, req, res) {
    List.update({ 'tasks._id': req.body.taskId }, { $push: {'tasks.$.attachments': { 'originalName': file.originalname, 'name': file.name, 'extension': file.extension } } }, function(err){
        if (err) return console.error(err);
        List.findOne({ 'tasks._id': req.body.taskId }, function(err, list) {
            if (err) return console.error(err);
            res.send(list);
        });
    });
    
};

apiController.removeFile = function (req, res) {
    fs.unlink('./public/uploads/'+req.body.file.name, function(err){
        if (err) return console.error(err);
    });
    List.update({ 'tasks._id': req.body.taskId }, { $pull: {'tasks.$.attachments': req.body.file } }, function(err){
        if (err) return console.error(err);
        res.end();
    });
};

apiController.removeTask = function (req, res) {
    for (var i = 0; i<req.body.task.attachments.length; i++) {
        fs.unlink('./public/uploads/'+req.body.task.attachments[i].name, function(err){
            if (err) return console.error(err);
        });
        List.update({ 'tasks._id': req.body.taskId }, { $pull: {'tasks.$.attachments': req.body.task.attachments[i] } }, function(err){
            if (err) return console.error(err);
        });
    }

    for (var i = 0; i<req.body.task.subtasks.length; i++) {
        List.update({ 'tasks._id': req.body.taskId }, { $pull: {'tasks.$.subtasks': req.body.task.subtasks[i] } }, function(err){
            if (err) return console.error(err);
        });
    }

    List.update({ 'tasks._id': req.body.task._id }, { $pull: {'tasks': req.body.task } }, function(err){
        if (err) return console.error(err);
        res.end();
    });
};

apiController.removeSubtask = function (req, res) {
    List.update({ 'tasks._id': req.body.taskId }, { $pull: {'tasks.$.subtasks': req.body.subtask } }, function(err){
        if (err) return console.error(err);
        res.end();
    });
};

module.exports = apiController;