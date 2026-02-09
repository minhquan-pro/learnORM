const authService = require("../services/auth.service");
const authConfig = require("@/config/auth");

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.register(email, password);
	const accessToken = authService.generateAccessToken(user);

	res.success({
		accessToken,
		accessTokenTTL: authConfig.accessTokenTTL,
	});
};

const getCurrentUser = async (req, res) => {
	res.success(res.auth.user);
};

module.exports = { register, getCurrentUser };
