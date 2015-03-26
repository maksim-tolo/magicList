var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.get('/checkEmail', apiController.checkEmail);

router.put('/createList', apiController.createList);

router.put('/createTask', apiController.createTask);

router.post('/changeListName', apiController.changeListName);

router.post('/removeList', apiController.removeList);

router.post('/changeTaskStatus', apiController.changeTaskStatus);

module.exports = router;