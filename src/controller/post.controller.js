const notificationService = require("@/services/notification.service");
const postService = require("../services/post.service");
const prisma = require("@/libs/prisma");

const getAll = async (req, res) => {
	const posts = await postService.getAll();

	const user = await prisma.user.findUnique({
		where: {
			id: 11,
		},
	});

	await notificationService.notify(user, "Chúc bạn một ngày tốt lành nha");

	res.success(posts);
};

module.exports = { getAll };
