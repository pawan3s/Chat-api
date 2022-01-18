const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationControler");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(authController.protect, conversationController.createConversation);

router
  .route("/:userId")
  .get(authController.protect, conversationController.getMyConversations);

module.exports = router;
