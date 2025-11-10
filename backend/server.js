// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sareeRouter from "./routes/sareeRouter.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"
const app = express();
const port = process.env.PORT || 4000;
app.set("view engine","ejs")
app.use(express.json());


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://handloom-saree-e-commerce-webapp-frontend-113c.onrender.com",
  "https://handloom-saree-e-commerce-webapp-2-admin2.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

 
connectDB();

// API endpoints
app.use("/api/saree", sareeRouter);
app.use("/api/cart",cartRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/orders",orderRouter);

app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is up: http://localhost:${port}`);
});

