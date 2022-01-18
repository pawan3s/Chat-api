const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const AsyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createConversation = AsyncHandler(async (req, res, next) => {
  if (!req.body.senderId || !req.body.receiverId)
    return next(new AppError("Please select whom to message", 400));

  const user1 = await User.findById(req.body.senderId);
  const user2 = await User.findById(req.body.receiverId);

  if (!user1 || !user2) {
    return next(new AppError("No users found with those ids !", 400));
  }
  const doc = await Conversation.findOne({
    members: { $all: [req.body.senderId, req.body.receiverId] },
  });

  if (doc) {
    return next(
      new AppError(
        "Already created conversation with these two users, can't create duplicate conversations",
        400
      )
    );
  }
  const newConversation = await Conversation.create({
    members: [req.body.senderId, req.body.receiverId],
  });

  res.status(201).json({
    status: "success",
    newConversation,
  });
});
//get single id conversations
exports.getMyConversations = AsyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: { $in: [req.params.userId] },
  });
  res.status(200).json({
    status: "success",
    total: conversations.length,
    conversations,
  });
});
