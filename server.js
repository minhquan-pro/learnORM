require("dotenv").config();

const express = require("express");
const prisma = require("./src/libs/prisma");

const rootRouter = require("./src/routes");
const responseFormat = require("./src/middlewares/responseFormat");

const app = express();
const port = 3000;

BigInt.prototype.toJSON = function () {
	return this.toString();
};

app.use("./api", rootRouter);
app.use(responseFormat);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/api/posts", async (req, res) => {
	const posts = await prisma.post.findMany({
		include: {
			user: true,
		},
	});
	res.send(posts);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
