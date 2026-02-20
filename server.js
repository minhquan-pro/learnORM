require("./polyfill");
require("dotenv").config();
require("module-alias/register");

const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const apiRouter = require("@/routes/api");
const responseFormat = require("@/middlewares/responseFormat");
const errorHandle = require("@/middlewares/errorHandle");
const notFound = require("@/middlewares/notFound");
const notificationService = require("@/services/notification.service");
const channelHandler = require("@/routes/channel");

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

channelHandler(io);

server.listen(port, () => {
	console.log(`listening on port ${port}`);
});
