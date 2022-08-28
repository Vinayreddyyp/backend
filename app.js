const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./src/routes/places-routes.js");
const usersRoutes = require("./src/routes/users-routes");
const HttpError = require("./src/models/http-error");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-with, Content-Type,Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH, DELETE");
	next();
});

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

mongoose
	.connect(
		"mongodb+srv://vinny1:mongodb2022@cluster0.406em.mongodb.net/places?retryWrites=true&w=majority"
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((error) => {
		console.log(error);
	});
