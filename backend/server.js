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
app.use(
  cors({
    origin: [
      "http://localhost:5174", // local frontend (Vite dev)
      "http://localhost:5173", //  admin
      "https://handloom-saree-e-commerce-webapp-frontend-113c.onrender.com" // your Render frontend
    ],
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

