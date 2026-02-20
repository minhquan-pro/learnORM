require("./polyfill");
require("dotenv").config();
require("module-alias/register");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const apiRouter = require("@/routes/api");
const responseFormat = require("@/middlewares/responseFormat");
const errorHandle = require("@/middlewares/errorHandle");
const notFound = require("@/middlewares/notFound");
const authConfig = require("@/config/auth");
const notificationService = require("@/services/notification.service");

const app = express();
const server = createServer(app);
const port = 3000;

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

notificationService.setSocket(io);

app.use(express.json());
app.use(cors());
app.use(responseFormat);

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandle);

io.on("connection", (socket) => {
	// Auth
	const token = socket.handshake.auth?.token;
	if (token) {
		try {
			const payload = jwt.verify(token, authConfig.jwtSecret);
			if (payload.exp < Date.now() / 1000) {
				socket.disconnect();
			}
		} catch (error) {
			socket.disconnect();
		}
	} else {
		socket.disconnect();
	}

	// Subscribe
	socket.on("subscribe", ({ channel }) => {
		socket.join(channel);
	});
});

server.listen(port, () => {
	console.log(`listening on port ${port}`);
});
