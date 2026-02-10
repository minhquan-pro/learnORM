const authService = require("../services/auth.service");
const authConfig = require("@/config/auth");

const register = async (req, res) => {
	const { email, password } = req.body;
	const userAgent = req.headers["user-agent"];
	const userTokens = await authService.handleRegister(email, password, userAgent);
	res.success(userTokens);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const userAgent = req.headers["user-agent"];
	const [error, userTokens] = await authService.handleLogin(email, password, userAgent);
	if (error) return res.unauthorized();

	res.success(userTokens);
};

const getCurrentUser = async (req, res) => {
	res.success(res.auth.user);
};

const refreshToken = async (req, res) => {
	const [error, data] = await authService.handleRefreshToken(req.body.refreshToken, req.headers["user-agent"]);
	if (error) return res.unauthorized();

	res.success(data);
};

module.exports = { login, register, getCurrentUser, refreshToken };
