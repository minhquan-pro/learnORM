const prisma = require("../libs/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authConfig = require("@/config/auth");

const saltRounds = 10;

class AuthService {
	async register(email, password) {
		const hashPassword = await bcrypt.hash(password, saltRounds);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashPassword,
			},
		});
		return user;
	}

	generateAccessToken(user) {
		const expireAt = Math.floor(Date.now() / 1000 + authConfig.accessTokenTTL);
		const token = jwt.sign(
			{
				sub: user.id,
				exp: expireAt,
			},
			authConfig.jwtSecret,
		);

		return token;
	}

	async getUserById(id) {
		const user = await prisma.user.findUnique({
			select: {
				id: true,
				username: true,
				email: true,
				firstName: true,
				lastName: true,
				avatar: true,
				isVerified: true,
			},
			where: {
				id,
			},
		});

		return user;
	}
}

module.exports = new AuthService();
