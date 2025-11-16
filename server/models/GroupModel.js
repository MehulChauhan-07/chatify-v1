import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  ],
  // Group admin controls
  admins: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Messages", required: false },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.Mixed, // To store selected fields of the message
    required: false,
  },
  // AI integration
  aiEnabled: {
    type: Boolean,
    default: false,
  },
  // Notification settings
  notificationSettings: {
    type: Map,
    of: {
      muted: {
        type: Boolean,
        default: false,
      },
      mentionsOnly: {
        type: Boolean,
        default: false,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

groupSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

groupSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Group = mongoose.model("Groups", groupSchema);
export default Group;
