const sleep = async (timeOut) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeOut);
	});
};

module.exports = sleep;
