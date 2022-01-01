const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: [true, "conversation id is required to message"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user id required to create message"],
    },
    message: {
      type: String,
      trim: true,
      required: [true, "message body is required"],
    },
  },
  { timeStamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
