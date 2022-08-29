const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

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

const signup = async (req, res, next) => {
	console.log("signUP function has been called", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passes,please check your data ", 422)
		);
	}
	const { email, name, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError("Signing up failed, please try again", 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"user name already exists, please login instead",
			422
		);
		return next(error);
	}

	const createUser = new User({
		name,
		email,
		image: "https://i.imgur.com/9PZ1reC.jpeg",
		password,
		places: [],
	});

	try {
		await createUser.save();
	} catch (err) {
		const error = new HttpError("Signing up failed please try again", 500);
		return next(error);
	}

	res.status(201).json({ user: createUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
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

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError(
			"Invalid Credentials,could not log you in",
			401
		);
		return next(error);
	}
	res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
