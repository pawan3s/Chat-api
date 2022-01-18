const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

router.route("/").post(authController.protect, messageController.createMessage);

router
  .route("/:id")
  .get(authController.protect, messageController.getAllMessages);

module.exports = router;
