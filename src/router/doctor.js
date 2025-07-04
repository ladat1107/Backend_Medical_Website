import express from 'express';


import { dischargedPayment, examinationAdvancePayment, examinationPayment, paraclinicalPayment, prescriptionPayment } from '../services/paymentService';
import { checkTokenWithCookie } from '../Middleware/JWTAction';
import { getStaffNameByIdController } from '../controllers/staffController';
import { createHandBookController, getAllHandBooksController, updateHandBookController } from '../controllers/handBookController';
import { getAllSchedulesController, getScheduleByDateAndDoctorController, getScheduleByStaffIdController, getScheduleByStaffIdFromTodayController, getScheduleInWeekController } from '../controllers/scheduleController';
import { createPrescriptionController, getPrescriptionByExaminationIdController, getPrescriptionsController, updatePrescriptionController, upsertPrescriptionController } from '../controllers/prescriptionController';
import { getAllDiseaseController, getDiseaseByNameController } from '../controllers/diseaseController';
import { getAllMedicinesController, getAllMedicinesForExamController, getMedicineByIdController } from '../controllers/medicineController';
import { createAppointmentController, createExaminationController, deleteExaminationController, getExaminationByIdController, getExaminationByUserIdController, getExaminationsController, getListToPayController, getMedicalRecordsController, getPatienStepsController, updateExaminationController, updateInpatientRoomController } from '../controllers/examinationController';
import { createOrUpdateVitalSignController, createVitalSignController, deleteVitalSignController, getVitalSignByExamIdController, updateVitalSignController } from '../controllers/vitalSignController';
import { createOrUpdateParaclinicalController, createParaclinicalController, createRequestParaclinicalController, deleteParaclinicalController, getParaclinicalByExamIdController, getParaclinicalsController, updateListPayParaclinicalsController, updateParaclinicalController } from '../controllers/paraclinicalController';
import dotenv from 'dotenv';
import { deleteAssistantForCustomerController, getConversationFromSearchController, getConversationForStaffController } from '../controllers/messageController';
import { getArrayAdminIdController, getArrayUserIdController, getDoctorBookingController } from '../controllers/userController';
import { getAvailableRoomsController } from '../controllers/roomController';
import { deleteAdvanceMoneyController } from '../controllers/advanceMoneyController';
dotenv.config();

let router = express.Router();
let initDoctorRoute = (app) => {
    router.all("*", checkTokenWithCookie)

    // router.post("/specialty", specialtyController.createSpecialty)
    // router.get("/getSpecialtySelect", specialtyController.getSpecialtySelect)
    // router.post("/createSpecialty", specialtyController.createSpecialty)
    // router.put("/updateSpecialty", specialtyController.updateSpecialty)
    // router.put("/blockSpecialty", specialtyController.blockSpecialty)
    // router.delete("/deleteSpecialty", specialtyController.deleteSpecialty)

    router.get("/getStaffNameById", getStaffNameByIdController)
    router.get("/getArrayUserId", getArrayUserIdController)
    router.get("/getArrayAdminId", getArrayAdminIdController)
    router.get("/getDoctorBooking", getDoctorBookingController)

    //--  HandBook
    router.get("/getAllHandBooks", getAllHandBooksController)
    router.post("/createHandBook", createHandBookController)
    router.put("/updateHandBook", updateHandBookController)

    //-- Schedule
    router.get("/getAllSchedules", getAllSchedulesController)
    router.get("/getScheduleByStaffId", getScheduleByStaffIdController)
    router.get("/getScheduleInWeek", getScheduleInWeekController)
    router.get("/getScheduleByStaffIdFromToday", getScheduleByStaffIdFromTodayController)
    router.get("/getScheduleByDateAndDoctor", getScheduleByDateAndDoctorController)

    //-- Prescription
    router.get("/getPrescriptionByExaminationId", getPrescriptionByExaminationIdController)
    router.post("/upsertPrescription", upsertPrescriptionController)

    //-- Disease
    router.get("/getDiseaseByName", getDiseaseByNameController)
    router.get("/getAllDisease", getAllDiseaseController)

    //-- Medicine
    router.get("/getAllMedicines", getAllMedicinesController)
    router.get("/getAllMedicinesForExam", getAllMedicinesForExamController)
    router.get("/getMedicineById", getMedicineByIdController)

    //-- Examination
    router.get("/getExaminationById", getExaminationByIdController)
    router.get("/getExaminationByUserId", getExaminationByUserIdController)
    router.post("/createExamination", createExaminationController)
    router.put("/updateExamination", updateExaminationController)
    router.put("/deleteExamination", deleteExaminationController)
    router.get("/getPatienSteps", getPatienStepsController)
    router.post("/createAppointment", createAppointmentController)

    //-- VitalSign
    router.get("/getVitalSignByExamId", getVitalSignByExamIdController)
    router.post("/createVitalSign", createVitalSignController)
    router.put("/updateVitalSign", updateVitalSignController)
    router.delete("/deleteVitalSign", deleteVitalSignController)
    router.post("/createOrUpdateVitalSign", createOrUpdateVitalSignController)

    //-- Paraclinical
    router.get("/getParaclinicalByExamId", getParaclinicalByExamIdController)
    router.post("/createParaclinical", createParaclinicalController)
    router.put("/updateParaclinical", updateParaclinicalController)
    router.delete("/deleteParaclinical", deleteParaclinicalController)
    router.post("/createOrUpdateParaclinical", createOrUpdateParaclinicalController)
    router.post("/createRequestParaclinical", createRequestParaclinicalController)

    //examination
    router.get("/getExaminations", getExaminationsController)
    router.get("/getListToPay", getListToPayController)
    router.get("/getParaclinicals", getParaclinicalsController)
    router.get("/getPrescriptions", getPrescriptionsController)
    router.put("/updatePrescription", updatePrescriptionController)
    router.put("/updateListPayParaclinicals", updateListPayParaclinicalsController)

    //Payment
    router.post("/paymentParaclinicalMomo", paraclinicalPayment)
    router.post("/paymentExaminationMomo", examinationPayment)
    router.post("/paymentPrescriptionMomo", prescriptionPayment)
    router.post("/paymentExaminationAdvanceMomo", examinationAdvancePayment)
    router.post("/paymentDischargedMomo", dischargedPayment)

    // -- Message
    router.get("/getConversationForStaff", getConversationForStaffController)
    router.delete("/deleteAssistantForCustomer", deleteAssistantForCustomerController)
    router.put("/getConversationFromSearch", getConversationFromSearchController)

    // -- Room
    router.get("/getAvailableRooms", getAvailableRoomsController)
    router.post("/createPrescription", createPrescriptionController)
    router.get("/getMedicalRecords", getMedicalRecordsController)
    router.post("/updateInpatientRoom", updateInpatientRoomController)

    //-- AdvanceMoney
    router.delete("/deleteAdvanceMoney", deleteAdvanceMoneyController)

    return app.use("/api/", router);
}
export default initDoctorRoute;