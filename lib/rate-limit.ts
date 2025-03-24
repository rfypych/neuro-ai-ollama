import { RatelimitConfig, Ratelimit, RatelimitResponse } from './types';

const ratelimitCache = new Map<string, { tokens: string[], timestamp: number }>();

export function rateLimit(config: RatelimitConfig): Ratelimit {
  return {
    limit: async (identifier: string): Promise<RatelimitResponse> => {
      const now = Date.now();
      const tokenKey = `${identifier}:${Math.floor(now / config.interval)}`;

      const cachedData = ratelimitCache.get(tokenKey) || {
        tokens: [],
        timestamp: now
      };

      const { tokens } = cachedData;
      const limit = config.uniqueTokenPerInterval;
      
      // Jika token sudah mencapai limit, rate limit tercapai
      if (tokens.length >= limit) {
        const reset = cachedData.timestamp + config.interval;
        return {
          success: false,
          limit,
          remaining: 0,
          reset
        };
      }

      // Tambahkan token baru
      tokens.push(identifier);
      
      // Update cache
      ratelimitCache.set(tokenKey, {
        tokens,
        timestamp: cachedData.timestamp
      });
      
      // Bersihkan cache yang sudah expired
      const tokensToClear = [];
      for (const [key, value] of ratelimitCache.entries()) {
        if (now - value.timestamp > config.interval) {
          tokensToClear.push(key);
        }
      }
      
      for (const key of tokensToClear) {
        ratelimitCache.delete(key);
      }
      
      return {
        success: true,
        limit,
        remaining: limit - tokens.length,
        reset: cachedData.timestamp + config.interval
      };
    }
  };
} 