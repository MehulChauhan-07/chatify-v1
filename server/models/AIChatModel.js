import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  title: {
    type: String,
    default: "New Conversation",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

aiChatSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const AIChat = mongoose.model("AIChats", aiChatSchema);
export default AIChat;
