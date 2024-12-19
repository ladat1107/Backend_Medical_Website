import express from 'express';
import userController from '../controllers/userController';
import examinationController from '../controllers/examinationController';
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
import { examinationPayment, paymentMomo, paymentMomoCallback } from '../services/paymentService';
require('dotenv').config();

let router = express.Router();
let initWebAuthenRounte = (app) => {
    router.all("*", checkTokenWithCookie)
    router.get("/getProfile", userController.getUserById)
    router.put("/profileUpdateInfo", userController.profileInfor)

    router.post("/confirmBooking", userController.confirmBooking)
    router.post("/confirmTokenBooking", userController.confirmTokenBooking)

    router.get("/getAppoinment", examinationController.getExaminationByUserId)
    router.delete("/cancelAppoinment", examinationController.deleteExamination)

    router.get("/paymentExaminationMomo", examinationPayment) 
    router.post("/callback", paymentMomoCallback)
    return app.use("/api/", router);
}
export default initWebAuthenRounte;