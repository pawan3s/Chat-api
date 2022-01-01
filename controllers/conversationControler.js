const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const AsyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createConversation = AsyncHandler(async (req, res, next) => {
  if (!req.body.user1 || !req.body.user2)
    return next(new AppError("Please select whom to message", 400));

  const user1 = await User.findById(req.body.user1);
  const user2 = await User.findById(req.body.user2);

  if (!user1 || !user2) {
    return next(new AppError("No users found with those ids !", 400));
  }

  if (user1.createdAt > user2.createdAt) {
    req.body.user1 = user2.id;
    req.body.user2 = user1.id;
  }

  const newConversation = await Conversation.create({
    user1: req.body.user1,
    user2: req.body.user2,
  });

  res.status(201).json({
    status: "success",
    newConversation,
  });
});

exports.getMyConversations = AsyncHandler(async (req, res, next) => {
  const fromConversation = await Conversation.find({
    user1: req.user.id,
  }).populate("Message");
  const toConversation = await Conversation.find({
    user2: req.user.id,
  }).populate("Message");
  const conversations = [...fromConversation, ...toConversation];

  res.status(200).json({
    status: "success",
    total: conversations.length,
    conversations,
  });
});
