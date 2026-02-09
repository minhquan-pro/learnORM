const prisma = require("../libs/prisma");

class PostService {
	async getAll() {
		const posts = await prisma.post.findMany({
			include: {
				user: true,
			},
		});
		return posts;
	}
}

module.exports = new PostService();
