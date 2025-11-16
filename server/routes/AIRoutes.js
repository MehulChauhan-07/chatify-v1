import { Router } from "express";
import {
  createAIChat,
  getAIChats,
  getAIChat,
  sendAIMessage,
  deleteAIChat,
  summarizeGroupChat,
  checkAIAvailability,
} from "../controllers/AIController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";

const aiRoutes = Router();

aiRoutes.post("/create", verifyToken, aiLimiter, createAIChat);
aiRoutes.get("/chats", verifyToken, getAIChats);
aiRoutes.get("/chat/:chatId", verifyToken, getAIChat);
aiRoutes.post("/chat/:chatId/message", verifyToken, aiLimiter, sendAIMessage);
aiRoutes.delete("/chat/:chatId", verifyToken, deleteAIChat);
aiRoutes.post("/summarize/:groupId", verifyToken, aiLimiter, summarizeGroupChat);
aiRoutes.get("/availability", verifyToken, checkAIAvailability);

export default aiRoutes;
