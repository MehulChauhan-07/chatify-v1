import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import groupRoutes from "./routes/GroupRoutes.js";
import setupSocket from "./socket.js";
import friendRequestsRoutes from "./routes/FriendRequestsRoute.js";
import aiRoutes from "./routes/AIRoutes.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = [
  process.env.ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

// Apply rate limiting
// app.use("/api/", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friend-requests", friendRequestsRoutes);
app.use("/api/ai", aiRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} at http://localhost:${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
