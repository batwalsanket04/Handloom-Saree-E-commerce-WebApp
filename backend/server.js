import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sareeRouter from "./routes/sareeRouter.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();

// api enspoints

app.use("/api/saree",sareeRouter)
app.use("/images",express.static('uploads'))

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`✅ Server is up: http://localhost:${port}`);
});
