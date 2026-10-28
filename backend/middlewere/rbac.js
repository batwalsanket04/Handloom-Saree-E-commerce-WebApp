import { authMiddleware } from "./auth.js";

/**
 * Middleware to authenticate user (must be logged in)
 * Attaches req.userId and req.userRole
 */
export const authenticateUser = authMiddleware;

/**
 * Middleware to restrict access to admin only
 * Must be used after authenticateUser
 */
export const adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied - Admin role required",
    });
  }
  next();
};

/**
 * Middleware to restrict access to specific roles
 * Usage: authorizeRoles("admin", "seller")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        message: "Role missing",
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied - Required role(s): ${roles.join(", ")}`,
      });
    }
    next();
  };
};

/**
 * Middleware to allow user to access own resources or admin all
 * Usage: authorizeOwnership({ param: "userId", body: "userId" })
 */
export const authorizeOwnership = (options = {}) => {
  const { param = "userId", body = "userId" } = options;
  
  return (req, res, next) => {
    // Admin can access everything
    if (req.userRole === "admin") {
      return next();
    }

    // Get resource user ID from params or body
    const resourceUserId = req.params[param] || req.body[body];

    if (req.userId && resourceUserId && req.userId.toString() === resourceUserId.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied - You can only access your own resources",
    });
  };
};

/**
 * Combined middleware for admin routes
 * Usage: router.get("/admin/users", adminAuth, getAllUsers)
 */
export const adminAuth = [authenticateUser, adminOnly];

/**
 * Combined middleware for user routes (authenticated users)
 * Usage: router.get("/profile", userAuth, getProfile)
 */
export const userAuth = [authenticateUser];

export default {
  authenticateUser,
  adminOnly,
  authorizeRoles,
  authorizeOwnership,
  adminAuth,
  userAuth,
};