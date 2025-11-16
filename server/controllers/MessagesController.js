import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    if (!user1 || !user2) {
      return response.status(400).json({ error: "Both user IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const editMessage = async (request, response) => {
  try {
    const { messageId } = request.params;
    const { content } = request.body;
    const userId = request.userId;

    if (!content) {
      return response.status(400).json({ error: "Content is required" });
    }

    const message = await Message.findOne({ _id: messageId, sender: userId });

    if (!message) {
      return response
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    }

    if (message.deleted) {
      return response.status(400).json({ error: "Cannot edit deleted message" });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();

    await message.save();

    return response.status(200).json({ message, success: true });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (request, response) => {
  try {
    const { messageId } = request.params;
    const userId = request.userId;

    const message = await Message.findOne({ _id: messageId, sender: userId });

    if (!message) {
      return response
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    }

    message.deleted = true;
    message.content = "This message was deleted";

    await message.save();

    return response.status(200).json({ message, success: true });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const addReaction = async (request, response) => {
  try {
    const { messageId } = request.params;
    const { emoji } = request.body;
    const userId = request.userId;

    if (!emoji) {
      return response.status(400).json({ error: "Emoji is required" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return response.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r) => r.user.toString() === userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      message.reactions = message.reactions.filter(
        (r) => !(r.user.toString() === userId && r.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({
        user: userId,
        emoji,
        timestamp: new Date(),
      });
    }

    await message.save();

    return response.status(200).json({ message, success: true });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const markMessagesAsRead = async (request, response) => {
  try {
    const { messageIds } = request.body;
    const userId = request.userId;

    if (!messageIds || !Array.isArray(messageIds)) {
      return response.status(400).json({ error: "Message IDs array is required" });
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      {
        $addToSet: {
          readBy: { user: userId, readAt: new Date() },
        },
      }
    );

    return response.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

