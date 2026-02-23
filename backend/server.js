// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sareeRouter from "./routes/sareeRouter.js";
import userRouter from "./routes/userRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"
import contactRouter from "./routes/contactRoute.js";
import healthRouter from "./routes/healthRoute.js";
const app = express();
const port = process.env.PORT || 4000;
app.set("view engine","ejs")
app.use(express.json());
app.use(cors());

connectDB();

// API endpoints
app.use("/api/saree", sareeRouter);
app.use("/api/cart",cartRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders",orderRouter);

app.use("/api/contact", contactRouter);
app.use("/api/health", healthRouter);

app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is up: http://localhost:${port}`);
});

