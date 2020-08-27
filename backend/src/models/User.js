//destructuring,trae una propiedad de un objeto,en este caso una funcion
const {Schema, model} = require("mongoose");

const userSchema = new Schema({
	name: String,
	mail: String,
	password: String,
	dot: Date,
	image: String, // path
	verifiedAt: { type: Date, default: Date.now },
	createdAt:  { type: Date, default: Date.now },
	updatedAt:  { type: Date, default: Date.now },
	deletedAt:  { type: Date, default: null },
})

module.exports = model('User',userSchema);