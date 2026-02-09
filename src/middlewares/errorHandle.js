const errorHandle = (err, req, res, next) => {
	res.error(String(err));
};

module.exports = errorHandle;
