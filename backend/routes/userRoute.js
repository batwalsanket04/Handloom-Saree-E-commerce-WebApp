import express from "express"
import { loginUser,registerUser,getProfile } from "../controller/userController.js"
import authMiddleware from "../middlewere/auth.js"

const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile", authMiddleware, getProfile)

export default userRouter