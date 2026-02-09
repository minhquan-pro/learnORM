const express = require("express");
const router = express.Router();

const authController = require("@/controller/auth.controller");
const authRequired = require("@/middlewares/authRequired");

router.post("/register", authController.register);
router.get("/me", authRequired, authController.getCurrentUser);

module.exports = router;
