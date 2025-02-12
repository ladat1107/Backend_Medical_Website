import express from 'express';
import userController from '../controllers/userController';
import { refreshToken } from "../Middleware/JWTAction"
require('dotenv').config();
let router = express.Router();
let authenRoute = (app, passport) => {
    app.get('/', async (req, res) => {
        try {
            res.send('Hello! This is medical server website.');
        } catch (error) {
            // Bắt lỗi và trả về lỗi
            console.error('Error inserting user:', error);
            res.status(500).json({ error: 'Đã có lỗi xảy ra' });
        }
    });

    // Định tuyến
    app.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.handleLoginGoogle);

    router.post("/registerUser", userController.handleRegisterUser)
    router.post("/handleLogin", userController.handleLogin)
    router.post("/confirmUser", userController.handleConfirm)
    router.post("/forgotPassword", userController.handleForgotPassword)
    router.get("/refreshToken", refreshToken)
    return app.use("/api/", router);
}
export default authenRoute;