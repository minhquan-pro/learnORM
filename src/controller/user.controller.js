const userService = require("../services/user.service");

const getAll = async (_, res) => {
	const users = await userService.getAll();
	res.success(users);
};

module.exports = { getAll };
