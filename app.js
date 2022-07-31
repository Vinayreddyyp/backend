const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./src/routes/places-routes.js");
const usersRoutes = require("./src/routes/users-routes");
const HttpError = require("./src/models/http-error");

const app = express();
app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("could not find the route", 404);
	throw error;
});

app.use((error, req, res, next) => {
	console.log("🚀 ~ file: app.js ~ line 8 ~ app.use ~ error", error);
	if (res.headerSent) {
		return next(error);
	}

	res.status(error.code || 500);
	res.json({ message: error.message || "An Unknown error occurred" });
});
app.listen(5000);