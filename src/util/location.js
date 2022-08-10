const axios = require("axios");
const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
	const data = response.data;

	if (!data || data.status === "ZERO_RESULTS") {
		const error = new HttpError(
			"could not find the location for the specified address",
			422
		);
		throw error;
	}

	const coordinates = data.results[0].geometry.location;

	return coordinates;
}

module.exports = getCoordsForAddress;
