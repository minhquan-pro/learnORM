const express = require("express");
const router = express.Router();

const messageController = require("@/controller/message.controller");

router.get("/last-messages", messageController.getLastMessages);

module.exports = router;
