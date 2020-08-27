
const {Schema, model, ObjectId} = require("mongoose");

const voteSchema = new Schema({
	user: {
		_id: ObjectId,
		name: "string"
	},
	meme: {
		_id : ObjectId
	},
	positive: Number,
	createdAt: Date,
	updatedAt: Date,
	deletedAt: Date
})

module.exports = model('Vote',voteSchema);