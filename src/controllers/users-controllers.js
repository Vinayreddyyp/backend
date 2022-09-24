const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const User = require("../models/user");

/* ======Get users form the DB======= */

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (err) {
		const error = new HttpError("Fetching users failed please try again", 500);
		return next(error);
	}

	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/*===== sign up the user with the given email, password and image ===== */

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passes,please check your data ", 422)
		);
	}

	const { email, name, password } = req.body;

	/* check the user is existed */

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError("Signing up failed, please try again", 500);
		return next(error);
	}

	/* 	throw error if user existed  */

	if (existingUser) {
		const error = new HttpError(
			"user name already exists, please login instead",
			422
		);
		return next(error);
	}

	/* hash the entered password for security point of view */

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError("Could not create user, please try again", 500);
		return next(error);
	}

	/* if user does not exists create new user in to the db */

	const createUser = new User({
		name,
		email,
		image: req.file.path,
		password: hashedPassword,
		places: [],
	});

	try {
		await createUser.save();
	} catch (err) {
		const error = new HttpError("Signing up failed please try again", 500);
		return next(error);
	}

	/* assign unique token to the user using jwt  */

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			"supersecret_do_not_share",
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later",
			500
		);
		return next(error);
	}

	/* sending the created details to the front end */

	res
		.status(201)
		.json({ userID: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
	/* destructure the email and password form the req body */
	const { email, password } = req.body;
	console.log(
		"🚀 ~ file: users-controllers.js ~ line 65 ~ login ~ password",
		password
	);
	console.log(
		"🚀 ~ file: users-controllers.js ~ line 65 ~ login ~ email",
		email
	);

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError("Logging failed, Please try again later", 500);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError(
			"Invalid Credentials,could not log you in",
			401
		);
		return next(error);
	}
	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			"Could not log you in, please check your credentials and try again",
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			"Invalid credentials, could not log you in",
			401
		);
		return next(error);
	}
	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			"supersecret_do_not_share",
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later",
			500
		);
		return next(error);
	}

	res.json({
		message: "Logged in",
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
