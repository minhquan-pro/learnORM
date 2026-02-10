const prisma = require("../libs/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authConfig = require("@/config/auth");
const randomString = require("@/utils/randomString");

const saltRounds = 10;

class AuthService {
	async handleRegister(email, password, userAgent) {
		const hashPassword = await bcrypt.hash(password, saltRounds);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashPassword,
			},
		});
		const userToken = await this.generateUserToken(user, userAgent);
		return userToken;
	}

	async handleLogin(email, password, userAgent) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) return [true, null];

		const isValid = await bcrypt.compare(password, user.password);
		if (isValid) {
			const userTokens = await this.generateUserToken(user, userAgent);
			return [null, userTokens];
		}

		return [true, null];
	}

	async generateRefreshToken(user, userAgent) {
		let token;
		let existed = false;

		do {
			token = randomString(32);
			const count = await prisma.refreshToken.count({
				where: {
					token,
				},
			});

			existed = count > 0;
		} while (existed);

		console.log(token);

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + authConfig.refreshTokenTTL);

		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				token,
				expiresAt,
				userAgent,
			},
		});

		return token;
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

	async handleRefreshToken(token, userAgent) {
		const refreshToken = await prisma.refreshToken.findUnique({
			where: {
				token,
				isRevoked: false,
				expiresAt: {
					gt: new Date(),
				},
			},
		});

		if (!refreshToken) {
			return [true, null];
		}

		const userTokens = await this.generateUserToken({ id: refreshToken.userId }, userAgent);
		await prisma.refreshToken.update({
			where: {
				id: refreshToken.id,
			},
			data: {
				isRevoked: true,
			},
		});

		return [null, userTokens];
	}

	async generateUserToken(user, userAgent) {
		const accessToken = await this.generateAccessToken(user);
		const refreshToken = await this.generateRefreshToken(user, userAgent);

		return {
			accessToken,
			accessTokenTTL: authConfig.accessTokenTTL,
			refreshToken,
		};
	}
}

module.exports = new AuthService();
