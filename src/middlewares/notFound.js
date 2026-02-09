const { httpCodes } = require("../../constants");

const notFound = (req, res) => {
	res.error(`Cannot ${req.method} ${req.originalUrl}`, httpCodes.notFound);
};

module.exports = notFound;
