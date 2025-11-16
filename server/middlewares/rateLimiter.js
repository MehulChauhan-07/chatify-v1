import rateLimit from "express-rate-limit";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// AI endpoints rate limiter (more restrictive)
export const aiLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // Limit to 10 AI requests per minute
  message: "Too many AI requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Message sending rate limiter
export const messageLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 50, // Limit to 50 messages per minute
  message: "Too many messages sent, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});
