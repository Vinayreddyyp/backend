const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw Error("Invalid authorization");
		}

		const decodedToken = jwt.verify(token, "supersecret_do_not_share");
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError("Invalid authorization", 401);
		return next(error);
	}
};
