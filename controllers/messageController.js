const Message = require("../models/mesaageModel");
const Conversation = require("../models/conversationModel");
const AsyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createMessage = AsyncHandler(async (req, res, next) => {
  const message = await Message.create({
    conversation: req.body.conversation,
    user: req.body.user,
    message: req.body.message,
  });

  res.status(201).json({
    status: "success",
    message,
  });
});

exports.getAllMessages = AsyncHandler(async (req, res, next) => {
  const conversationId = await Conversation.findById(req.params.id);
  if (!conversationId) {
    return next(new AppError("No conversation found with that id", 401));
  }
  const messages = await Message.find({
    conversation: req.params.id,
  });

  res.status(200).json({
    status: "success",
    total: messages.length,
    messages,
  });
});
