const AsyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/nodeMailer");
const bcrypt = require("bcrypt");
const APIServices = require("../utils/apiServices");
const AppError = require("../utils/appError");
//cloudinery photo upload
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//@update single user
//method:PUT
//routes:api/v1/users/:id
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Profile_pictures",
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({ storage: cloudStorage, fileFilter: multerFilter });

exports.uploadProfilePic = upload.single("profilePicture");

exports.updatePic = AsyncHandler(async (req, res, next) => {
  req.body.profilePicture = req.file.path;
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: doc,
  });
});

//@CreateUSer
//method:POST
//routes:api/v1/users

exports.createUser = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already Exists, please login", 404));
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
          subject: "Account Verification Link",
          message,
        });
        res
          .status(200)
          .send(
            "A verification email has been sent to " +
              user.email +
              ". Please click on link to verify"
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

//@get all users
//method:GET
//routes:api/v1/users

exports.getAllUsers = AsyncHandler(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};

  const features = new APIServices(User.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});

//@get single user
//method:GET
//routes:api/v1/users/:id

exports.getSingleUser = AsyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
