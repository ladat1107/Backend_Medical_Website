import express from 'express';
import userController from '../controllers/userController';
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();

let router = express.Router();
let initWebAuthenRounte = (app) => {
    router.all("*", checkTokenWithCookie)
    router.get("/getProfile", userController.getUserById)
    router.put("/profileUpdateInfo", userController.profileInfor)

    router.post("/confirmBooking", userController.confirmBooking)
    router.post("/confirmTokenBooking", userController.confirmTokenBooking)
    return app.use("/api/", router);
}
export default initWebAuthenRounte;