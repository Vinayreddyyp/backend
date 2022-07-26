const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error.js");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
let DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "ONe of the best most famous sky scrappers in the world",
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: "20 W 34th st, New York, NY 10001",
		creator: "u1",
	},
];

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => p.id === placeId);
	if (!place) {
		throw new HttpError("Could not find the place from th provided Id", 404);
	}
	res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const place = DUMMY_PLACES.filter((p) => p.creator === userId);
	if (!place || place.length === 0) {
		throw new HttpError("Could not find the place from th provided Id", 404);
	}
	res.json({ place });
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passes,please check your data ", 422)
		);
	}
	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const userId = uuidv4();
	const createdPlace = {
		userId,
		title,
		description,
		location: coordinates,
		address,
		creator,
	};
	DUMMY_PLACES.push(createdPlace);
	res.status(200).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError("Invalid inputs passes,please check your data ", 422);
	}
	const { title, description } = req.body;

	const placeId = req.params.pid;

	const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatedPlace.title = title;
	updatedPlace.description = description;
	DUMMY_PLACES[placeIndex] = updatePlace;
	res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
	const placeId = req.params.id;
	if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
		throw new HTTPError("Could not find a place for the id", 404);
	}
	DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
	res.status(200).json({ message: "Deleted place" });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
