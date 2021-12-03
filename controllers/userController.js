const AsyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/nodeMailer");
const bcrypt = require("bcrypt");

//@CreateUSer
//method:POST
//routes:api/v1/users

exports.createUser = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send({
      msg: "User exists already please login",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  user.save((err) => {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    const token = new Token({
      userID: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    token.save(async (err) => {
      if (err) {
        return res.status(500).send({ msg: err.message, err });
      }
      const message = `Hello ${req.body.username},\n\nPlease verify your account by clicking the link: \nhttp://${req.headers.host}/api/v1/users/confirmation/${user.email}/${token.token}\n\nThank You!! \n Pawan Subedi`;
      try {
        await sendEmail({
          email: user.email,
          subject: "Account VErification Link",
          message,
        });
        res
          .status(200)
          .send(
            "A verification email has been sent to " +
              user.email +
              "Please click on link to verify"
          );
      } catch (error) {
        res.status(500).send({
          status: "failed",
          msg: "Technical isse! Couldnot send email.",
          error,
        });
      }
    });
  });
});
