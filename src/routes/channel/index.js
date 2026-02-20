const jwt = require("jsonwebtoken");
const authConfig = require("@/config/auth");

const channels = require("./channels.route");

function channelHandler(io) {
	let userId;
	io.on("connection", (socket) => {
		// Auth
		const token = socket.handshake.auth?.token;
		if (token) {
			try {
				const payload = jwt.verify(token, authConfig.jwtSecret);
				if (payload.exp < Date.now() / 1000) {
					socket.disconnect();
				}
				userId = payload.sub;
			} catch (error) {
				socket.disconnect();
			}
		} else {
			socket.disconnect();
		}

		const user = { id: userId };
		// Subscribe
		socket.on("subscribe", ({ channel }) => {
			Object.entries(channels).forEach(([pattern, handler]) => {
				if (RegExp(pattern).test(channel)) {
					const isAllow = handler(user, channel);
					if (isAllow) {
						socket.join(channel);
						io.to(socket.id).emit("info", `subscribe_succeeded: ${channel}`);
					} else {
						io.to(socket.id).emit("subscribe_error", `${channel}`);
					}
					return;
				}
			});
		});
	});
}

module.exports = channelHandler;
