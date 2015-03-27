var mongoose = require('mongoose');

var listShema = new mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	listName: String,
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	membersEmail: [],
	tasks:
	[{
		taskName: String,
		complited: Boolean,
		attachments: [],
		description: String,
		deadline: Date,
		subtasks:
		[{
			subtasksName: String,
			complited: Boolean
		}]
	}]
});

module.exports = mongoose.model('List', listShema);