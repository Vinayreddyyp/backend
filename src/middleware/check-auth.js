const HttpError = require("../models/http-error");
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw Error("Invalid authorization");
		}
	} catch (err) {
		const error = new HttpError("Invalid authorization", 401);
		return next(error);
	}
};
