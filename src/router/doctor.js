import express from 'express';


import { examinationPayment, paraclinicalPayment, prescriptionPayment } from '../services/paymentService';
import { checkTokenWithCookie } from '../Middleware/JWTAction';
import { getStaffNameByIdController } from '../controllers/staffController';
import { createHandBookController, getAllHandBooksController, updateHandBookController } from '../controllers/handBookController';
import { getAllSchedulesController, getScheduleByStaffIdController, getScheduleInWeekController } from '../controllers/scheduleController';
import { getPrescriptionByExaminationIdController, getPrescriptionsController, updatePrescriptionController, upsertPrescriptionController } from '../controllers/prescriptionController';
import { getAllDiseaseController, getDiseaseByNameController } from '../controllers/diseaseController';
import { getAllMedicinesController, getAllMedicinesForExamController, getMedicineByIdController } from '../controllers/medicineController';
import { createExaminationController, deleteExaminationController, getExaminationByIdController, getExaminationByUserIdController, getExaminationsController, getListToPayController, getPatienStepsController, updateExaminationController } from '../controllers/examinationController';
import { createOrUpdateVitalSignController, createVitalSignController, deleteVitalSignController, getVitalSignByExamIdController, updateVitalSignController } from '../controllers/vitalSignController';
import { createOrUpdateParaclinicalController, createParaclinicalController, createRequestParaclinicalController, deleteParaclinicalController, getParaclinicalByExamIdController, getParaclinicalsController, updateListPayParaclinicalsController, updateParaclinicalController } from '../controllers/paraclinicalController';
import dotenv from 'dotenv';
import { deleteAssistantForCustomerController, getConversationForStaffController } from '../controllers/messageController';
import { getArrayAdminIdController, getArrayUserIdController } from '../controllers/userController';
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

    //--  HandBook
    router.get("/getAllHandBooks", getAllHandBooksController)
    router.post("/createHandBook", createHandBookController)
    router.put("/updateHandBook", updateHandBookController)

    //-- Schedule
    router.get("/getAllSchedules", getAllSchedulesController)
    router.get("/getScheduleByStaffId", getScheduleByStaffIdController)
    router.get("/getScheduleInWeek", getScheduleInWeekController)

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

    //-- Appointment
    // router.get("/getAllAppointments", appointmentController.getAllAppointments)
    // router.get("/getAllAppointmentsByDate", appointmentController.getAllAppointmentsByDate)
    // router.get("/getAppointmentByUserId", appointmentController.getAppointmentByUserId)
    // router.get("/getAppointmentByStaffId", appointmentController.getAppointmentByStaffId)
    // router.get("/searchAppointment", appointmentController.searchAppointment)
    // router.get("/searchAppointmentWithStaffId", appointmentController.seachAppointmentWithStaffId)
    // router.post("/createAppointment", appointmentController.createAppointment)
    // router.delete("/deleteAppointment", appointmentController.deleteAppointment)

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

    // -- Message
    router.get("/getConversationForStaff", getConversationForStaffController)
    router.delete("/deleteAssistantForCustomer", deleteAssistantForCustomerController)


    return app.use("/api/", router);
}
export default initDoctorRoute;