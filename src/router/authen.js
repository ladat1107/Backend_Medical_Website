import express from 'express';
import userController from '../controllers/userController';
import { refreshToken } from "../Middleware/JWTAction"
require('dotenv').config();
let router = express.Router();
let authenRoute = (app) => {
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
    router.post("/handleLogin", userController.handleLogin)
    router.get("/refreshToken", refreshToken)
    return app.use("/", router);
}
export default authenRoute;