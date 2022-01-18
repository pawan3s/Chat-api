const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const conversationSchema = mongoose.Schema(
  {
    // user1: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: [true, "user1 is required to create conversation"],
    // },
    // user2: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: [true, "user2 is required to create conversation"],
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
    members: {
      type: Array,
    },
  },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
  { timeStamps: true }
);

// conversationSchema.virtual("messages", {
//   ref: "Message",
//   foreignField: "conversation",
//   localField: "_id",
// });

// conversationSchema.pre("save", async function (next) {
//   const doc = await this.constructor.findOne({
//     members: { $in: [req.body.senderId && req.body.receiverId] },
//   });

//   if (doc) {
//     return next(
//       new AppError(
//         "Already created conversation with these two users, can't create duplicate conversations",
//         400
//       )
//     );
//   }

//   next();
// });

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
