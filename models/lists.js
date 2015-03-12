var mongoose = require('mongoose');

var listShema = new.mongoose.Shema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	listName: String,
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

mongoose.model('List', userSchema);

module.exports = userSchema;