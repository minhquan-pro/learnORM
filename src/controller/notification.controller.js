const notificationService = require("@/services/notification.service");

const getNotifications = async (req, res) => {
	const userId = req?.auth?.user?.id;
	const notifications = await notificationService.getNotificationByUserId(userId);
	res.success(notifications);
};

module.exports = { getNotifications };
