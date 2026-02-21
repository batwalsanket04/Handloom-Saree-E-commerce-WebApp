import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  // Accept either `token` header or `Authorization: Bearer <token>`
  const headerToken = req.headers.token || req.headers.authorization;
  let token = null;
  if (!headerToken) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  if (headerToken.startsWith("Bearer ")) {
    token = headerToken.split(" ")[1];
  } else {
    token = headerToken;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // require token instance to match current server instance id
    if (!decoded.instance || decoded.instance !== process.env.SERVER_INSTANCE_ID) {
      return res.status(401).json({ success: false, message: "Token invalid after server restart, please login again" });
    }
    // attach userId for existing controllers
    req.body.userId = decoded.id;

    // also attach full user object if available
    try {
      const user = await userModel.findById(decoded.id).select("-password");
      if (user) req.user = user;
    } catch (e) {
      // ignore
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;

export const authorizeAdmin = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ success: false, message: "Not authorized" });
  if (user.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required" });
  next();
};