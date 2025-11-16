import aiService from "../services/aiService.js";
import AIChat from "../models/AIChatModel.js";

export const createAIChat = async (req, res) => {
  try {
    const { userId } = req;

    const aiChat = await AIChat.create({
      user: userId,
      messages: [],
      title: "New Conversation",
    });

    return res.status(201).json({ aiChat });
  } catch (error) {
    console.error("Error creating AI chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAIChats = async (req, res) => {
  try {
    const { userId } = req;

    const aiChats = await AIChat.find({ user: userId }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({ aiChats });
  } catch (error) {
    console.error("Error getting AI chats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAIChat = async (req, res) => {
  try {
    const { userId } = req;
    const { chatId } = req.params;

    const aiChat = await AIChat.findOne({ _id: chatId, user: userId });

    if (!aiChat) {
      return res.status(404).json({ message: "AI chat not found" });
    }

    return res.status(200).json({ aiChat });
  } catch (error) {
    console.error("Error getting AI chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendAIMessage = async (req, res) => {
  try {
    const { userId } = req;
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!aiService.isAvailable()) {
      return res.status(503).json({
        message: "AI service is not configured. Please set OPENAI_API_KEY.",
      });
    }

    const aiChat = await AIChat.findOne({ _id: chatId, user: userId });

    if (!aiChat) {
      return res.status(404).json({ message: "AI chat not found" });
    }

    // Add user message
    aiChat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Prepare messages for AI (include conversation history)
    const conversationMessages = aiChat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await aiService.chat(conversationMessages);

    // Add AI response to chat
    aiChat.messages.push({
      role: "assistant",
      content: aiResponse.content,
      timestamp: new Date(),
    });

    // Update title if it's the first message
    if (aiChat.messages.length === 2) {
      aiChat.title = message.substring(0, 50) + (message.length > 50 ? "..." : "");
    }

    await aiChat.save();

    return res.status(200).json({
      message: "Message sent successfully",
      aiChat,
      aiResponse: aiResponse.content,
    });
  } catch (error) {
    console.error("Error sending AI message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAIChat = async (req, res) => {
  try {
    const { userId } = req;
    const { chatId } = req.params;

    const aiChat = await AIChat.findOneAndDelete({ _id: chatId, user: userId });

    if (!aiChat) {
      return res.status(404).json({ message: "AI chat not found" });
    }

    return res.status(200).json({ message: "AI chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const summarizeGroupChat = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { messages } = req.body;

    if (!aiService.isAvailable()) {
      return res.status(503).json({
        message: "AI service is not configured.",
      });
    }

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const summary = await aiService.generateGroupSummary(messages);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error summarizing group chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAIAvailability = async (req, res) => {
  try {
    const isAvailable = aiService.isAvailable();
    return res.status(200).json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking AI availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
