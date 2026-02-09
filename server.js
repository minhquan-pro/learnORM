require("dotenv").config();
require("./polyfill");
require("module-alias/register");

const express = require("express");
const cors = require("cors");

const rootRouter = require("@/routes");
const responseFormat = require("@/middlewares/responseFormat");
const errorHandle = require("@/middlewares/errorHandle");
const notFound = require("@/middlewares/notFound");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(responseFormat);

app.use("/api", rootRouter);

app.use(notFound);
app.use(errorHandle);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
