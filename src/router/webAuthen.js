import express from 'express';
import userController, { confirmBookingController, confirmTokenBookingController, getMedicalHistoriesController, getUserByIdController, profileInforController } from '../controllers/userController';
import examinationController, { deleteExaminationController, getExaminationByUserIdController } from '../controllers/examinationController';
import { appoinmentPayment, examinationPayment, paraclinicalPayment, paymentMomo, paymentMomoCallback } from '../services/paymentService';
import { checkTokenWithCookie } from '../Middleware/JWTAction';
require('dotenv').config();

let router = express.Router();
let initWebAuthenRounte = (app) => {
    // Cần check đăng nhập
    router.all("*", checkTokenWithCookie) 
    
    router.get("/getProfile", getUserByIdController)
    router.put("/profileUpdateInfo", profileInforController)
    router.get("/getMedicalHistories", getMedicalHistoriesController)

    router.post("/confirmBooking", confirmBookingController)
    router.post("/confirmTokenBooking", confirmTokenBookingController)

    router.get("/getAppoinment", getExaminationByUserIdController)
    router.delete("/cancelAppoinment", deleteExaminationController)

    router.get("/paymentAppoinmentMomo", appoinmentPayment)
    router.post("/callback", paymentMomoCallback)
    return app.use("/api/", router);
}
export default initWebAuthenRounte;