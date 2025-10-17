// lib/rate-limit.ts - PRODUCTION RATE LIMITING
import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In production, use Redis for distributed rate limiting
// For now, use Map (works for single server)
const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

export function rateLimit(
  config: RateLimitConfig = DEFAULT_CONFIG
): (request: NextRequest) => { success: boolean; remaining: number; reset: number } {
  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + config.interval,
      });

      return {
        success: true,
        remaining: config.maxRequests - 1,
        reset: now + config.interval,
      };
    }

    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    entry.count++;

    return {
      success: true,
      remaining: config.maxRequests - entry.count,
      reset: entry.resetTime,
    };
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute