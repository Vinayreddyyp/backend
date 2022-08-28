const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "AIzaSyDt7HEo0TWKd8Ox97QCXKPSBAe4gXVeqe8";

async function getCoordsForAddress(address) {
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			address
		)}&key=${API_KEY}`
	);

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
