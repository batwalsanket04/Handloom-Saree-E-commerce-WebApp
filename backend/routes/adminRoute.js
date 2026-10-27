import express from "express";

import {
authMiddleware,
authorizeRole
}
from "../middlewere/auth.js";


import {
getAllUsers,
deleteUser,
updateUserRole
}
from "../controller/userController.js";


const adminRouter=express.Router();



adminRouter.use(
authMiddleware,
authorizeRole(
"admin",
"super_admin"
)
);



adminRouter.get(
"/users",
getAllUsers
);



adminRouter.delete(
"/users/:userId",
deleteUser
);



adminRouter.put(
"/users/:userId/role",
updateUserRole
);



export default adminRouter;