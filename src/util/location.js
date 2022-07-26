const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "AIzaSyDt7HEo0TWKd8Ox97QCXKPSBAe4gXVeqe8";

async function getCoordsForAddress(address) {
	console.log(
		"🚀 ~ file: location.js ~ line 6 ~ getCoordsForAddress ~ address",
		address
	);
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			address
		)}&key=${API_KEY}`
	);
	console.log(
		"🚀 ~ file: location.js ~ line 11 ~ getCoordsForAddress ~ response",
		response
	);

	const data = response.data;
	console.log(
		"🚀 ~ file: location.js ~ line 14 ~ getCoordsForAddress ~ data",
		data
	);
	if (!data || data.status === "ZERO_RESULTS") {
		const error = new HttpError(
			"could not find the location for the specified address",
			422
		);
		throw error;
	}

	const coordinates = data.results[0].geometry.location;
	console.log(
		"🚀 ~ file: location.js ~ line 24 ~ getCoordsForAddress ~ coordinates",
		coordinates
	);
	return coordinates;
}

module.exports = getCoordsForAddress;
