import express from 'express';
import { confirmBookingController, confirmTokenBookingController, getMedicalHistoriesController, getUserByIdController, profileInforController } from '../controllers/userController';
import { deleteExaminationController, getExaminationByUserIdController, getExamToNoticeController, getListAdvanceMoneyController, getListInpationsController, updateOldParaclinicalController } from '../controllers/examinationController';
import { appoinmentPayment, examinationPayment, paraclinicalPayment, paymentMomo, paymentMomoCallback } from '../services/paymentService';
import { checkTokenWithCookie } from '../Middleware/JWTAction';
import { getNumberMessageUnreadController, upsertConversationController } from '../controllers/messageController';
import { createNotificationController, getAllNotificationsController, getAllUserToNotifyController, markAllReadController, updateNotificationController } from '../controllers/notificationController';
import { createMessageController } from '../controllers/messageController';
import { createAdvanceMoneyController } from '../controllers/advanceMoneyController';
import { deletePrescriptionController } from '../controllers/prescriptionController';
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
    router.put("/updateOldParaclinical", updateOldParaclinicalController)
    router.delete("/cancelAppoinment", deleteExaminationController)

    router.get("/paymentAppoinmentMomo", appoinmentPayment)
    router.post("/callback", paymentMomoCallback)

    router.get("/getAllUserToNotify", getAllUserToNotifyController)
    router.get("/getAllNotifications", getAllNotificationsController)
    router.post("/createNotification", createNotificationController)
    router.put("/updateNotification", updateNotificationController)
    router.put("/markAllRead", markAllReadController)

    router.get("/getConversation", upsertConversationController)
    router.get("/getNumberMessageUnread", getNumberMessageUnreadController)

    router.get("/getListAdvanceMoney", getListAdvanceMoneyController)

    router.post("/createMessage", createMessageController)

    router.get("/getExamToNotice", getExamToNoticeController)
    router.get("/getListInpatients", getListInpationsController)
    router.post("/createAdvanceMoney", createAdvanceMoneyController)
    router.delete("/deletePrescription", deletePrescriptionController)

    return app.use("/api/", router);
}
export default initWebAuthenRounte;