const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    expiresAT: {
      type: Date,
      default: Date.now(),
      index: { expires: 86400000 },
    },
  },
});
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
