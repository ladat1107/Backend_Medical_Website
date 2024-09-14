import express from 'express';
import userController from '../controllers/userController';
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();

let router = express.Router();
let initWebRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)

    app.get('/', async (req, res) => {
        try {
            res.send('Hello! This is medical server website.');
        } catch (error) {
            // Bắt lỗi và trả về lỗi
            console.error('Error inserting user:', error);
            res.status(500).json({ error: 'Đã có lỗi xảy ra' });
        }
    });


    router.post("/registerUser", userController.handleRegisterUser)
    router.get("/confirm", userController.handleConfirm)
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