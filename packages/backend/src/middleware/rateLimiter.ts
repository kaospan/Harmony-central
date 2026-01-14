import rateLimit from "express-rate-limit";
import { RateLimitConfig } from "@harmony-central/types";

/**
 * Create a rate limiter middleware for cost control
 * Limits API requests per IP address
 */
export function createRateLimiter(config: RateLimitConfig) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.maxRequests,
    message: config.message || {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
}

/**
 * Default rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // General API endpoints - 100 requests per 15 minutes
  general: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: "Too many requests from this IP, please try again later.",
  },

  // Comparison endpoint - 30 requests per 15 minutes (more costly operation)
  comparison: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 30,
    message:
      "Too many comparison requests from this IP, please try again later.",
  },

  // Song creation - 20 requests per 15 minutes
  creation: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    message: "Too many song creation requests, please try again later.",
  },
};
