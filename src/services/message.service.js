const prisma = require("@/libs/prisma");
const sleep = require("@/utils/sleep");

class MessageService {
	async getLastMessages(lastMessageId) {
		const messages = await prisma.message.findMany({
			select: {
				id: true,
				message: true,
			},
			where: {
				id: {
					gt: BigInt(lastMessageId),
				},
			},
			take: 10,
		});

		return messages;
	}

	async getLastMessagesPolling(lastMessageId = 0) {
		let messages = await this.getLastMessages(lastMessageId);

		if (lastMessageId) {
			const startTime = Date.now() / 1000;
			const timeout = 10;

			while (true) {
				const currentTime = Date.now() / 1000;
				const diff = currentTime - startTime;
				if (diff >= timeout) break;

				await sleep(1000);

				messages = await this.getLastMessages(lastMessageId);
				if (messages.length > 0) break;
			}
		}

		return messages;
	}
}

module.exports = new MessageService();
