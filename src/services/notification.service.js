const prisma = require("@/libs/prisma");

class NotificationService {
	socket;

	setSocket(socket) {
		this.socket = socket;
	}

	async notify(user, message) {
		const channel = `user-${user.id}`;

		const notification = await prisma.notification.create({
			data: {
				userId: user.id,
				content: message,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		this.socket.to(channel).emit("notification", notification);
	}

	async getNotificationByUserId(userId) {
		const notifications = await prisma.notification.findMany({
			where: {
				userId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return notifications;
	}
}

module.exports = new NotificationService();
