interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(maxRequests: number, intervalMinutes: number) {
    this.config = {
      maxRequests,
      interval: intervalMinutes * 60 * 1000,
    }
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier

    if (!store[key] || store[key].resetTime < now) {
      // Initialize or reset
      store[key] = {
        count: 1,
        resetTime: now + this.config.interval,
      }
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: store[key].resetTime,
      }
    }

    if (store[key].count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: store[key].resetTime,
      }
    }

    store[key].count++

    return {
      allowed: true,
      remaining: this.config.maxRequests - store[key].count,
      resetTime: store[key].resetTime,
    }
  }

  reset(identifier: string): void {
    delete store[identifier]
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter(100, 1) // 100 requests per minute
export const webRateLimiter = new RateLimiter(20, 1) // 20 requests per minute

