const AsyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  Token.create();
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.confirmEmail = AsyncHandler(async (req, res, next) => {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      return next(new AppError("Token Expired", 404));
    }
    User.findOne(
      { _id: token.userID, email: req.params.email },
      (err, user) => {
        if (!user) {
          return next(
            new AppError(
              "We were unable to find a user for this verification. Please SignUp!",
              401
            )
          );
        } else if (user.isVerified) {
          return res
            .status(200)
            .send("User has been already verified. Please Login");
        } else {
          user.isVerified = true;
          user.save((err) => {
            if (err) {
              return res.status(500).send({ msg: err.message });
            } else {
              return res
                .status(200)
                .send("Your account has been successfully verified");
            }
          });
        }
      }
    );
  });
});

exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return next(new AppError("Invalid Email or Password", 401));
  }
  // const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return next(new AppError("Invalid Email or Password", 401));
  }
  if (user.isVerified === false) {
    return next(new AppError("Account not verified", 403));
  }
  createSendToken(user, 200, req, res);
});

exports.protect = AsyncHandler(async (req, res, next) => {
  let token;

  // check token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("You are not logged in!", 400));

  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const existUser = await User.findById(decoded.id);

  // check if user has activated account
  if (existUser.isVerified === false)
    return next(
      new AppError(
        "user has not activated account and can't request for any routes",
        400
      )
    );

  // check if user still exists
  if (!existUser) {
    return next(new AppError(401, "The user doesn't exist anymore!"));
  }

  // check if user changed password after the token was issued
  // if (existUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError(401, "Password has been changed !"));
  // }

  // access granted to next middleware
  req.user = existUser;
  next();
});
