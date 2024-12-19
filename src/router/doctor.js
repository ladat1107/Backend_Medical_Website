import express from 'express';

import handBookController from '../controllers/handBookController';
import scheduleController from '../controllers/scheduleController';
import prescriptionController from '../controllers/prescriptionController';
import diseaseController from '../controllers/diseaseController';
import medicineController from '../controllers/medicineController';
import examinationController from '../controllers/examinationController';
import vitalSignController from '../controllers/vitalSignController';
import paraclinicalController from '../controllers/paraclinicalController';
import appointmentController from '../controllers/appointmentController';
import staffController from '../controllers/staffController';

import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
import { examinationPayment, paraclinicalPayment } from '../services/paymentService';
require('dotenv').config();

let router = express.Router();
let initDoctorRoute = (app) => {
    router.all("*", checkTokenWithCookie)

    // router.post("/specialty", specialtyController.createSpecialty)
    // router.get("/getSpecialtySelect", specialtyController.getSpecialtySelect)
    // router.post("/createSpecialty", specialtyController.createSpecialty)
    // router.put("/updateSpecialty", specialtyController.updateSpecialty)
    // router.put("/blockSpecialty", specialtyController.blockSpecialty)
    // router.delete("/deleteSpecialty", specialtyController.deleteSpecialty)

    router.get("/getStaffNameById", staffController.getStaffNameById)

    //--  HandBook
    router.get("/getAllHandBooks", handBookController.getAllHandBooks)
    router.post("/createHandBook", handBookController.createHandBook)
    router.put("/updateHandBook", handBookController.updateHandBook)

    //-- Schedule
    router.get("/getAllSchedules", scheduleController.getAllSchedules)
    router.get("/getScheduleByStaffId", scheduleController.getScheduleByStaffId)
    router.get("/getScheduleInWeek", scheduleController.getScheduleInWeek)

    //-- Prescription
    router.get("/getPrescriptionByExaminationId", prescriptionController.getPrescriptionByExaminationId)
    router.post("/upsertPrescription", prescriptionController.upsertPrescription)

    //-- Disease
    router.get("/getDiseaseByName", diseaseController.getDiseaseByName)
    router.get("/getAllDisease", diseaseController.getAllDisease)

    //-- Medicine
    router.get("/getAllMedicines", medicineController.getAllMedicines)
    router.get("/getAllMedicinesForExam", medicineController.getAllMedicinesForExam)
    router.get("/getMedicineById", medicineController.getMedicineById)

    //-- Examination
    router.get("/getExaminationById", examinationController.getExaminationById)
    router.get("/getExaminationByUserId", examinationController.getExaminationByUserId)
    router.post("/createExamination", examinationController.createExamination)
    router.put("/updateExamination", examinationController.updateExamination)
    router.put("/deleteExamination", examinationController.deleteExamination)

    //-- VitalSign
    router.get("/getVitalSignByExamId", vitalSignController.getVitalSignByExamId)
    router.post("/createVitalSign", vitalSignController.createVitalSign)
    router.put("/updateVitalSign", vitalSignController.updateVitalSign)
    router.delete("/deleteVitalSign", vitalSignController.deleteVitalSign)
    router.post("/createOrUpdateVitalSign", vitalSignController.createOrUpdateVitalSign)

    //-- Paraclinical
    router.get("/getParaclinicalByExamId", paraclinicalController.getParaclinicalByExamId)
    router.post("/createParaclinical", paraclinicalController.createParaclinical)
    router.put("/updateParaclinical", paraclinicalController.updateParaclinical)
    router.delete("/deleteParaclinical", paraclinicalController.deleteParaclinical)
    router.post("/createOrUpdateParaclinical", paraclinicalController.createOrUpdateParaclinical)
    router.post("/createRequestParaclinical", paraclinicalController.createRequestParaclinical)

    //-- Appointment
    router.get("/getAllAppointments", appointmentController.getAllAppointments)
    router.get("/getAllAppointmentsByDate", appointmentController.getAllAppointmentsByDate)
    router.get("/getAppointmentByUserId", appointmentController.getAppointmentByUserId)
    router.get("/getAppointmentByStaffId", appointmentController.getAppointmentByStaffId)
    router.get("/searchAppointment", appointmentController.searchAppointment)
    router.get("/searchAppointmentWithStaffId", appointmentController.seachAppointmentWithStaffId)
    router.post("/createAppointment", appointmentController.createAppointment)
    router.delete("/deleteAppointment", appointmentController.deleteAppointment)

    //examination
    router.get("/getExaminations", examinationController.getExaminations)
    router.get("/getListToPay", examinationController.getListToPay)
    router.get("/getParaclinicals", paraclinicalController.getParaclinicals)
    router.get("/getPrescriptions", prescriptionController.getPrescriptions)
    router.put("/updatePrescription", prescriptionController.updatePrescription)
    router.put("/updateListPayParaclinicals", paraclinicalController.updateListPayParaclinicals)

    //Payment
    router.post("/paymentParaclinicalMomo", paraclinicalPayment)
    router.post("/paymentExaminationMomo", examinationPayment)
    return app.use("/api/", router);
}
export default initDoctorRoute;