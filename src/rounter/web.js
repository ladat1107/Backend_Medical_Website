import express from 'express';
import userController from '../controllers/userController';
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();
let router = express.Router();
let initWebRount = (app) => {
    router.all("*", checkTokenWithCookie, checkAuthentication)

    router.post("/registerUser", userController.handleRegisterUser)
    router.post("/handleLogin", userController.handleLogin)
    router.post("/handleLogout", userController.handleLogout)

    router.get("/account", userController.handleGetAccount)
    router.get("/user/get", userController.getFunction)
    router.get("/user/getById", userController.getFunctionById)
    router.post("/user/create", userController.createFunction)
    router.put("/user/update", userController.updateFunction)
    router.delete("/user/delete", userController.deleteFunction)

    return app.use("/api/", router);
}
export default initWebRount;