const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
	title: { type: "string", required: true },
	description: { type: "string", required: true },
	image: { type: "string", required: true },
	address: { type: "string", required: true },
	location: {
		lat: { type: "string", required: true },
		lng: { type: "string", required: true },
	},
	creator: { type: "string", required: true },
});

module.exports = mongoose.model("Place", placeSchema);
