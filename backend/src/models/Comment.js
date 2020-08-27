
const {Schema, model, ObjectId} = require("mongoose");

const commentSchema = new Schema({
		user: {
			_id: ObjectId,
			name: String,
		},
		meme: {
			_id: ObjectId
		},
		children: [{
				comment: String,
				createdAt: Date,
				deletedAt: Date,
				user: {
					_id: ObjectId,
					name: String
				}
			}
		],
		comment: String,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date
	
	
})

module.exports = model('Comment',commentSchema);