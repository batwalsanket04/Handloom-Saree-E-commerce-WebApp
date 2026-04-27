import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sareeRouter from "./routes/sareeRouter.js";
import userRouter from "./routes/userRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import healthRouter from "./routes/healthRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Security: hide framework info
app.disable("x-powered-by");

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://handloom-saree-e-commerce-webapp-frontend-113c.onrender.com",
      "https://handloom-saree-e-commerce-webapp-2-admin2.onrender.com",
      "https://handloom-saree-e-commerce-webapp-1-hcwc.onrender.com",
    ],
    credentials: true,
  })
);

connectDB();

// API endpoints
app.use("/api/saree", sareeRouter);
app.use("/api/cart", cartRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/health", healthRouter);

// Health check
app.get("/", (req, res) => {
  res.send("API Working");
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation Error", errors: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate field value", field: Object.keys(err.keyValue) });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is up: http://localhost:${port}`);
});

