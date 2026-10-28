import { tokenCache, cache } from "../config/redis.js";
import RefreshToken from "../models/refreshtoken.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

/**
 * Redis-integrated authentication helpers
 * Provides fast token validation with PostgreSQL fallback
 */

// Re-export tokenCache for direct access
export { tokenCache };

// Cache user data in Redis for fast lookups
export const cacheUser = async (userId, userData, ttlSeconds = 3600) => {
  const key = `user:${userId}`;
  return await cache.set(key, JSON.stringify(userData), ttlSeconds);
};

// Get cached user data
export const getCachedUser = async (userId) => {
  const key = `user:${userId}`;
  const data = await cache.get(key);
  return data ? JSON.parse(data) : null;
};

// Invalidate user cache (on profile update, role change, etc.)
export const invalidateUserCache = async (userId) => {
  const key = `user:${userId}`;
  return await cache.del(key);
};

// Check if access token is blacklisted (logout)
export const isTokenBlacklisted = async (token) => {
  return await tokenCache.isBlacklisted(token);
};

// Blacklist access token on logout
export const blacklistAccessToken = async (token) => {
  // Access tokens expire in 15 minutes, so blacklist for same duration
  return await tokenCache.blacklistAccessToken(token, 15 * 60);
};

// Store refresh token in Redis for fast validation
export const cacheRefreshToken = async (refreshToken, userData, ttlSeconds = 7 * 24 * 60 * 60) => {
  return await tokenCache.setRefreshToken(refreshToken, userData, ttlSeconds);
};

// Get cached refresh token data
export const getCachedRefreshToken = async (refreshToken) => {
  return await tokenCache.getRefreshToken(refreshToken);
};

// Remove refresh token from Redis (on logout/revoke)
export const removeCachedRefreshToken = async (refreshToken) => {
  return await tokenCache.delRefreshToken(refreshToken);
};

/**
 * Validate refresh token with Redis cache first, fallback to PostgreSQL
 * Returns { user, isValid, isRevoked }
 */
export const validateRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return { user: null, isValid: false, isRevoked: true, reason: "Token missing" };
  }

  // 1. Check Redis cache first (fast)
  const cached = await getCachedRefreshToken(refreshToken);
  if (cached) {
    // Verify token signature
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await getCachedUser(decoded.id) || await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }
      });
      
      if (user) {
        await cacheUser(decoded.id, user.toJSON ? user.toJSON() : user);
        return { user, isValid: true, isRevoked: false };
      }
    } catch (err) {
      // Token invalid, fall through to DB check
    }
  }

  // 2. Fallback to PostgreSQL
  try {
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken, revoked: false }
    });

    if (!storedToken) {
      return { user: null, isValid: false, isRevoked: true, reason: "Token not found or revoked" };
    }

    // Check expiry
    if (new Date() > storedToken.expiresAt) {
      await storedToken.update({ revoked: true });
      return { user: null, isValid: false, isRevoked: true, reason: "Token expired" };
    }

    // Verify JWT signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return { user: null, isValid: false, isRevoked: true, reason: "User not found" };
    }

    // Cache for next time
    await cacheRefreshToken(refreshToken, user.toJSON ? user.toJSON() : user);
    await cacheUser(decoded.id, user.toJSON ? user.toJSON() : user);

    return { user, isValid: true, isRevoked: false };
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return { user: null, isValid: false, isRevoked: true, reason: "Invalid token signature" };
    }
    if (err.name === "TokenExpiredError") {
      return { user: null, isValid: false, isRevoked: true, reason: "Token expired" };
    }
    console.error("Refresh token validation error:", err);
    return { user: null, isValid: false, isRevoked: true, reason: "Validation error" };
  }
};

/**
 * Revoke all refresh tokens for a user (on password change, security event)
 */
export const revokeAllUserRefreshTokens = async (userId) => {
  // Revoke in PostgreSQL
  await RefreshToken.update(
    { revoked: true },
    { where: { userId, revoked: false } }
  );
  
  // Note: Redis cache will naturally expire, but we could scan and delete
  // For now, rely on TTL expiry
  await invalidateUserCache(userId);
};

/**
 * Generate tokens and store refresh token in both Redis and PostgreSQL
 */
export const generateAndStoreTokens = async (user, res) => {
  const { createAccessToken, createRefreshToken } = await import("../Utils/token.js");
  
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // Store in PostgreSQL (persistent)
  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // Cache in Redis (fast validation)
  const userData = user.toJSON ? user.toJSON() : user;
  await cacheRefreshToken(refreshToken, userData);
  await cacheUser(user.id, userData);

  // Set httpOnly cookie
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  });

  return { accessToken, refreshToken };
};

/**
 * Clear auth cookies
 */
export const clearAuthCookies = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });
};

export default {
  cacheUser,
  getCachedUser,
  invalidateUserCache,
  isTokenBlacklisted,
  blacklistAccessToken,
  cacheRefreshToken,
  getCachedRefreshToken,
  removeCachedRefreshToken,
  validateRefreshToken,
  revokeAllUserRefreshTokens,
  generateAndStoreTokens,
  clearAuthCookies
};