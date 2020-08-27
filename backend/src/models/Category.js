
const {Schema, model} = require("mongoose");

const categorySchema = new Schema({
	name: String,
	Slug: String,
	description: String,
	createdAt: Date,
	updatedAt: Date,
	deletedAt: Date
})

module.exports = model('Category',categorySchema);