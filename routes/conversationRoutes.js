const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationControler");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, conversationController.getMyConversations)
  .post(authController.protect, conversationController.createConversation);

module.exports = router;
