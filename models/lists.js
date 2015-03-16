var mongoose = require('mongoose');

var listShema = new.mongoose.Shema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	listName: String,
	members: [{ type: Number, ref: 'User' }],
	item:
	[{
		itemName: String,
		complited: Boolean,
		attechments: [],
		description: String,
		deadline: Date,
		subtasks:
		[{
			subtasksName: String,
			complited: Boolean
		}]
	}]
});

module.exports = mongoose.model('List', userSchema);