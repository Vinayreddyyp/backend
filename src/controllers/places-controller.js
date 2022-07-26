const HttpError = require("../models/http-error.js");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Something went wronng, could not find a place",
			404
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			"Could not find the place from th provided Id",
			404
		);
		return next(error);
	}
	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let places;

	try {
		places = await Place.find({ creator: userId });
	} catch (errors) {
		const error = new HttpError(
			"Fetching places failed, please try again later",
			500
		);
		return next(error);
	}
	if (!places || places.length === 0) {
		return next(
			new HttpError("Could not find the place from th provided Id", 404)
		);
	}
	if (places.length !== 0) {
		res.json({
			places: places.map((place) => place.toObject({ getters: true })),
		});
	}
};

const createPlace = async (req, res, next) => {
	console.log("req in the created place", req);
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

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: "https://i.imgur.com/9PZ1reC.jpeg",
		creator,
	});

	let user;
	try {
		user = await User.findById(creator);
	} catch (err) {
		const error = new HttpError("something went wrong", 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError("we cant find the user in the data", 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdPlace.save({ session: sess });
		user.places.push(createdPlace);
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (e) {
		const error = new HttpError(
			"Creating place failed, please try again.",
			500
		);
		return next(error);
	}

	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passes,please check your data ", 422)
		);
	}
	const { title, description } = req.body;

	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError("something went wrong", 500);
		return next(error);
	}
	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError("something went wrong", 500);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res) => {
	const placeId = req.params.pid;
	console.log(
		"🚀 ~ file: places-controller.js ~ line 161 ~ deletePlace ~ placeId",
		placeId
	);

	let place;

	try {
		place = await Place.findById(placeId).populate("creator");
	} catch (err) {
		const error = new HttpError("something went wrong", 500);
		return next(error);
	}
	if (!place) {
		const error = new HttpError("couldnt find place", 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await place.remove({ session: sess });
		place.creator.places.pull(place);
		await place.creator.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError("something went wrong", 500);
		return next(error);
	}
	res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
