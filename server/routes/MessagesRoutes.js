import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getMessages,
  editMessage,
  deleteMessage,
  addReaction,
  markMessagesAsRead,
} from "../controllers/MessagesController.js";
import { messageLimiter } from "../middlewares/rateLimiter.js";

const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.put("/edit/:messageId", verifyToken, messageLimiter, editMessage);
messagesRoutes.delete("/delete/:messageId", verifyToken, deleteMessage);
messagesRoutes.post("/reaction/:messageId", verifyToken, addReaction);
messagesRoutes.post("/mark-read", verifyToken, markMessagesAsRead);

export default messagesRoutes;
