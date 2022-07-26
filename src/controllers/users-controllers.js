const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const DUMMY_USERS = [
	{
		id: "u1",
		name: "Vinay",
		email: "vinay@gmail.com",
		password: "vinay@1234",
	},
];

const getUsers = (req, res, next) => {
	res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError("Invalid inputs passes,please check your data ", 422);
	}
	const { email, name, password } = req.body;
	const hasUser = DUMMY_USERS.find((user) => user.email === email);
	if (hasUser) {
		throw new HttpError("Could not create user, email already exists", 422);
	}
	const userId = uuidv4();
	const createUser = {
		id: userId,
		email,
		name,
		password,
	};
	DUMMY_USERS.push(createUser);

	res.status(201).json({ user: createUser });
};

const login = (req, res, next) => {
	const { email, password } = req.body;
	console.log(
		"🚀 ~ file: users-controllers.js ~ line 32 ~ login ~ email",
		email,
		password
	);

	const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

	if (!identifiedUser || identifiedUser.password !== password) {
		throw new HttpError(
			"could not identify  the user, credentials seems to be wrong",
			401
		);
	}
	res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
