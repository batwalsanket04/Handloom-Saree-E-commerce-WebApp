import express from "express"
import { loginUser,registerUser,getProfile,adminLogin,verifyToken } from "../controller/userController.js"
import authMiddleware from "../middlewere/auth.js"

const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/admin-login",adminLogin)
userRouter.get("/profile", authMiddleware, getProfile)
userRouter.get("/verify-token", authMiddleware, verifyToken)

export default userRouter
