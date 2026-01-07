
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sareeRoute from "./routes/sareeRouter.js";
import orderRoute from "./routes/orderRoute.js";
import dotenv from "dotenv";
import { upload } from "./uploads/Upload.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/images", express.static("uploads"));

/* ROUTES */
app.use("/api/saree", sareeRoute);
app.use("/api/order", orderRoute);

/* DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

/* SERVER */
app.listen(5000, () => console.log("Server running on port 5000"));
