import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: "Too many login attempts from this IP, try again after 15 minutes",
});

export const GeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

