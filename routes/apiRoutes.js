var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/getUser', apiController.getUser);

router.post('/checkEmail', apiController.checkEmail);

router.put('/createList', apiController.createList);

router.put('/createTask', apiController.createTask);

router.put('/createSubtask', apiController.createSubtask);

router.put('/addListMember', apiController.addListMember);

router.post('/changeListName', apiController.changeListName);

router.post('/removeList', apiController.removeList);

router.post('/changeTaskStatus', apiController.changeTaskStatus);

router.post('/changeSubtask', apiController.changeSubtask);

router.post('/confirmInboxList', apiController.confirmInboxList);

router.post('/rejectInboxList', apiController.rejectInboxList);

router.post('/leaveList', apiController.leaveList);

router.post('/removeUserFromList', apiController.removeUserFromList);

router.post('/updateDate', apiController.updateDate);

router.post('/updateDescription', apiController.updateDescription);

router.post('/removeFile', apiController.removeFile);

router.post('/removeTask', apiController.removeTask);

router.post('/removeSubtask', apiController.removeSubtask);

module.exports = router;