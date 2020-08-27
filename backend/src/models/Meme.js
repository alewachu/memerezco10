
const {Schema, model, ObjectId} = require("mongoose");

const memeSchema = new Schema({
	category: {
		_id:ObjectId,
		name: String,
		slug: String,
	},
	user: {
		_id: ObjectId,
		name: String,
	},
	title: String,
	image: String,
	upvotes: Number,
	downvotes: Number,
	comments: Number,
	createdAt: Date,
	updatedAt: Date,
	deletedAt: Date
})

module.exports = model('Meme',memeSchema);