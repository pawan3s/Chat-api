const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .put(userController.uploadProfilePic, userController.updatePic);

router.route("/confirmation/:email/:token").get(authController.confirmEmail);
router.route("/login").post(authController.login);
router.route("/register").post(userController.createUser);

module.exports = router;
