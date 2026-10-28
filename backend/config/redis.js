import { createClient } from "redis";

console.log("REDIS_URL:", process.env.REDIS_URL ? "Set" : "Not set");
console.log("REDIS_PASSWORD:", process.env.REDIS_PASSWORD ? "Set" : "Not set");

// Fix Upstash Redis URL: convert https:// to rediss:// for TLS
let redisUrl = process.env.REDIS_URL;
if (redisUrl && redisUrl.startsWith("https://")) {
  redisUrl = redisUrl.replace("https://", "rediss://");
  console.log("Fixed Redis URL protocol to rediss://");
} else if (redisUrl && redisUrl.startsWith("http://")) {
  redisUrl = redisUrl.replace("http://", "redis://");
  console.log("Fixed Redis URL protocol to redis://");
}

const redisClient = createClient({
  url: redisUrl,
  password: process.env.REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis max retries reached");
        return new Error("Max retries reached");
      }
      const delay = Math.min(retries * 100, 3000);
      return delay;
    },
    // Don't set tls manually - rediss:// protocol handles it automatically
  },
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", async () => {
  console.log("Redis ready");
  
  // Test connection
  try {
    await redisClient.set("test", "Redis Working", { EX: 60 });
    const value = await redisClient.get("test");
    console.log("Redis Test Value:", value);
  } catch (error) {
    console.error("Redis test failed:", error.message);
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Connect with error handling
let isConnected = false;
const connectRedis = async () => {
  if (isConnected) return redisClient;
  
  try {
    await redisClient.connect();
    isConnected = true;
    return redisClient;
  } catch (error) {
    console.error("Failed to connect to Redis:", error.message);
    // Don't throw - allow app to run without Redis
    return null;
  }
};

// Initialize connection
connectRedis();

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<string|null>} Cached value or null
   */
  async get(key) {
    try {
      if (!isConnected) return null;
      return await redisClient.get(key);
    } catch (error) {
      console.error("Redis GET error:", error.message);
      return null;
    }
  },

  /**
   * Set value in cache with expiry
   * @param {string} key - Cache key
   * @param {string} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds
   */
  async set(key, value, ttlSeconds = 3600) {
    try {
      if (!isConnected) return false;
      await redisClient.set(key, value, { EX: ttlSeconds });
      return true;
    } catch (error) {
      console.error("Redis SET error:", error.message);
      return false;
    }
  },

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   */
  async del(key) {
    try {
      if (!isConnected) return false;
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error("Redis DEL error:", error.message);
      return false;
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Cache key
   */
  async exists(key) {
    try {
      if (!isConnected) return false;
      return await redisClient.exists(key);
    } catch (error) {
      console.error("Redis EXISTS error:", error.message);
      return false;
    }
  },

  /**
   * Get multiple keys
   * @param {string[]} keys - Array of cache keys
   */
  async mget(keys) {
    try {
      if (!isConnected) return keys.map(() => null);
      return await redisClient.mGet(keys);
    } catch (error) {
      console.error("Redis MGET error:", error.message);
      return keys.map(() => null);
    }
  },

  /**
   * Set multiple keys
   * @param {Object} keyValuePairs - Object of key-value pairs
   * @param {number} ttlSeconds - Time to live in seconds
   */
  async mset(keyValuePairs, ttlSeconds = 3600) {
    try {
      if (!isConnected) return false;
      const pipeline = redisClient.multi();
      for (const [key, value] of Object.entries(keyValuePairs)) {
        pipeline.set(key, value, { EX: ttlSeconds });
      }
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Redis MSET error:", error.message);
      return false;
    }
  },

  /**
   * Invalidate cache by pattern (using SCAN)
   * @param {string} pattern - Key pattern (e.g., "cms:*")
   */
  async invalidatePattern(pattern) {
    try {
      if (!isConnected) return false;
      let cursor = 0;
      do {
        const [newCursor, keys] = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
        cursor = newCursor;
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } while (cursor !== "0");
      return true;
    } catch (error) {
      console.error("Redis invalidatePattern error:", error.message);
      return false;
    }
  },
};

/**
 * Session/Token cache helpers
 */
export const tokenCache = {
  /**
   * Cache refresh token for fast validation
   * @param {string} token - Refresh token
   * @param {Object} userData - User data to cache
   * @param {number} ttlSeconds - TTL in seconds (default 7 days)
   */
  async setRefreshToken(token, userData, ttlSeconds = 7 * 24 * 60 * 60) {
    const key = `refresh_token:${token}`;
    return await cache.set(key, JSON.stringify(userData), ttlSeconds);
  },

  /**
   * Get cached refresh token data
   * @param {string} token - Refresh token
   */
  async getRefreshToken(token) {
    const key = `refresh_token:${token}`;
    const data = await cache.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Remove refresh token from cache (on logout/revoke)
   * @param {string} token - Refresh token
   */
  async delRefreshToken(token) {
    const key = `refresh_token:${token}`;
    return await cache.del(key);
  },

  /**
   * Blacklist access token (on logout)
   * @param {string} token - Access token
   * @param {number} ttlSeconds - TTL matching token expiry
   */
  async blacklistAccessToken(token, ttlSeconds = 15 * 60) {
    const key = `blacklist:${token}`;
    return await cache.set(key, "1", ttlSeconds);
  },

  /**
   * Check if access token is blacklisted
   * @param {string} token - Access token
   */
  async isBlacklisted(token) {
    const key = `blacklist:${token}`;
    return await cache.exists(key);
  },
};

/**
 * CMS cache helpers
 */
export const cmsCache = {
  /**
   * Get cached CMS data
   * @param {string} section - CMS section (e.g., "about", "homepage", "banner")
   */
  async get(section) {
    const key = `cms:${section}`;
    const data = await cache.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set CMS data in cache
   * @param {string} section - CMS section
   * @param {Object} data - CMS data
   * @param {number} ttlSeconds - TTL in seconds (default 1 hour)
   */
  async set(section, data, ttlSeconds = 3600) {
    const key = `cms:${section}`;
    return await cache.set(key, JSON.stringify(data), ttlSeconds);
  },

  /**
   * Invalidate CMS cache for section
   * @param {string} section - CMS section
   */
  async invalidate(section) {
    const key = `cms:${section}`;
    return await cache.del(key);
  },

  /**
   * Invalidate all CMS cache
   */
  async invalidateAll() {
    return await cache.invalidatePattern("cms:*");
  },
};

export default redisClient;
export { connectRedis, isConnected };