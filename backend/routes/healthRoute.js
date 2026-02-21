import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, status: "ok", time: Date.now(), instance: process.env.SERVER_INSTANCE_ID || null });
});

export default router;
