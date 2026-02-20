const express = require("express");
const router = express.Router();

const notificationController = require("../../controller/notification.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/", authRequired, notificationController.getNotifications);

module.exports = router;
