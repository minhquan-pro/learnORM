const notFound = (req, res) => {
	res.error(`Cannot ${req.method} ${req.originalUrl}`, 404);
};

module.exports = notFound;
