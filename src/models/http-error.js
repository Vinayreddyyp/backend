class HttpError extends Error {
	constructor(message, error) {
		console.log("message", message);
		super(message);
		this.error = error;
	}
}

module.exports = HttpError;
