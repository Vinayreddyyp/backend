class HttpError extends Error {
	constructor(message, error) {
		console.log(
			"🚀 ~ file: http-error.js ~ line 3 ~ HttpError ~ constructor ~ error",
			error
		);
		super(message);
		this.error = error;
	}
}

module.exports = HttpError;
