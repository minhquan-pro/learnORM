const prisma = require("../libs/prisma");

class UserService {
	async getAll() {
		const users = await prisma.user.findMany();
		return users;
	}
}

module.exports = new UserService();
