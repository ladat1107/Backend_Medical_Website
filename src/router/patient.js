import express from 'express';
import userController from '../controllers/userController';
import departmentController from '../controllers/departmentController';
import staffController from '../controllers/staffController';
import handBookController from '../controllers/handBookController';
import serviceTypeController from '../controllers/serviceTypeController';
import bedController from '../controllers/bedController';
import patientController from '../controllers/patientController';
import roomController from '../controllers/roomController';
import roleController from '../controllers/roleController';
import relativeController from '../controllers/relativeController';
import familyHistoryController from '../controllers/familyHistoryController';
import surgicalHistoryController from '../controllers/surgicalHistoryController';
import surgicalHistoryUserController from '../controllers/surgicalHistoryUserController';
import disabilityController from '../controllers/disabilityController';
import disabilityUserController from '../controllers/disabilityUserController';
import allergyController from '../controllers/allergyController';
import allergyUserController from '../controllers/allergyUserController';
import conditionAtBirthController from '../controllers/conditionAtBirthController';
import insuranceController from '../controllers/insuranceController';
import scheduleController from '../controllers/scheduleController';
import appointmentController from '../controllers/appointmentController';
import examinationController from '../controllers/examinationController';
import vitalSignController from '../controllers/vitalSignController';
import paraclinicalController from '../controllers/paraclinicalController';
import medicineController from '../controllers/medicineController';
import prescriptionController from '../controllers/prescriptionController';
import diseaseController from '../controllers/diseaseController';
import specialtyController from '../controllers/specialtyController';
import dataService from "../utils/data/dataService"
require('dotenv').config();
import db from "../models/index";

let router = express.Router();
let initPatientRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)

    //------> Specialty
    router.get("/getSpcialtyHome", specialtyController.getSpcialtyHome)

    // DEPARTMENT
    router.get("/getDepartmenHome", departmentController.getDepartmentHome);

    // HANDBOOK
    router.get("/getHandBookHome", handBookController.getHandBookHome);
    router.get("/getHandBookByDeparment", handBookController.getHandBookDeparment);

    //USER
    router.get("/getDoctorHome", userController.getDoctorHome);

    //SECTION
    router.get("/getServicesHome", dataService.getServiceHome);

    return app.use("/api/", router);
}
export default initPatientRount;