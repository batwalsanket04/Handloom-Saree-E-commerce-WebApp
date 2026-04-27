import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * Auth Middleware - Validates JWT token and extracts user info
 * Sets req.userId and req.userRole for use in route handlers
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    // Extract token from "Bearer <token>" format
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = tokenParts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * Admin Authorization Middleware
 * Ensures user has admin role
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

/**
 * Seller Authorization Middleware
 * Ensures user has seller or admin role
 */
export const authorizeSeller = (req, res, next) => {
  if (req.userRole !== "seller" && req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Seller or Admin access required",
    });
  }
  next();
};

/**
 * User Authorization Middleware
 * Ensures user is authenticated and is the resource owner or admin
 */
export const authorizeUser = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;

  if (req.userRole === "admin") {
    next();
  } else if (req.userId && resourceUserId && req.userId.toString() === resourceUserId.toString()) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to access this resource",
    });
  }
};

/**
 * Optional Auth Middleware
 * Attempts to extract user info if token is provided, but doesn't fail if it's not
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    }
    next();
  } catch (error) {
    // If token is invalid or missing, continue without authentication
    next();
  }
};

export default authMiddleware;