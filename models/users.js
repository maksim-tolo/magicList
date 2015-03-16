var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	lists: [{ type: Number, ref: 'List' }]
});

module.exports = mongoose.model('User', userSchema);