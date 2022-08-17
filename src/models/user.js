const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
	name: { type: "string", required: true },
	email: { type: "string", required: true, unique: true },
	password: { type: "string", required: true, minLength: 5 },
	image: { type: "string", required: true },
	places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
