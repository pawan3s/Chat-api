const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, messageController.getAllMessages)
  .post(authController.protect, messageController.createMessage);

module.exports = router;
