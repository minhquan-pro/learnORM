const { httpCodes } = require("../../constants");

const responseFormat = (_, res, next) => {
	res.success = (data, status = httpCodes.ok) => {
		res.status(status).json({
			status: "success",
			data,
		});
	};

	res.error = (error, status = httpCodes.internalServerError) => {
		res.status(status).json({
			status: "error",
			error,
		});
	};

	next();
};

module.exports = responseFormat;
