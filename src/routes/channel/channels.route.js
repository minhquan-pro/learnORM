const channels = {
	"user-*": (user, channel) => {
		return `user-${user.id}` === channel;
	},
};

module.exports = channels;
