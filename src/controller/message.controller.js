const messageService = require("@/services/message.service");

const getLastMessages = async (req, res) => {
	const messages = await messageService.getLastMessagesPolling(req.query.last_message_id);
	res.success(messages);
};

module.exports = { getLastMessages };
