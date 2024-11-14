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

import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();

let router = express.Router();
let initWebRount = (app) => {
    router.all("*", checkTokenWithCookie)

    router.get("/account", userController.handleGetAccount)

    //-- User   
    router.get("/getUserById", userController.getUserById)
    router.get("/getUserByCid", userController.getUserByCid)
    router.put("/profileUpdateInfo", userController.profileInfor)
    router.put("/profileUpdatePassword", userController.profilePassword)
    //------> Admin CRUD User
    router.get("/admin/getAllUser", userController.getAllUser)
    router.post("/admin/createUser", userController.createUser)
    router.put("/admin/updateUser", userController.updateUser)
    router.put("/admin/blockUser", userController.blockUser)
    router.delete("/admin/deleteUser", userController.deleteUser)

    //-- Department
    router.get("/getAllNameDepartment", departmentController.getAllNameDepartment)
    router.get("/getDepartmentById", departmentController.getDepartmentById)
    router.get("/getAllStaffInDepartment", departmentController.getAllStaffInDepartment)
    ////-----> Admin C.U.D department
    router.get("/getAllDepartment", departmentController.getAllDepartment)
    router.post("/admin/createDepartment", departmentController.createDepartment)
    router.put("/admin/updateDepartment", departmentController.updateDepartment)
    router.put("/admin/blockDepartment", departmentController.blockDepartment)
    router.delete("/admin/deleteDepartment", departmentController.deleteDepartment)

    //-- Staff
    router.get("/getAllStaff", staffController.getAllStaff)
    router.get("/getStaffById", staffController.getStaffById)
    router.get("/getStaffbyDepartmentId", staffController.getStaffbyDepartmentId)
    router.get("/getStaffByRole", staffController.getStaffByRole)
    router.get("/getStaffByName", staffController.getStaffByName)

    router.put("/profileUpdateStaff", staffController.profileStaff)

    //--  HandBook
    router.get("/getAllHandBooks", handBookController.getAllHandBooks)
    router.get("/getHandBookById", handBookController.getHandBookById)
    router.post("/createHandBook", handBookController.createHandBook)
    router.put("/updateHandBook", handBookController.updateHandBook)
    router.get("/getAllTags", handBookController.getAllTags)
    //// ----> Admin
    router.get("/admin/getHandBooksByStatus", handBookController.getHandBooksByStatus)
    router.put("/admin/updateHandbookStatus", handBookController.updateHandbookStatus)

    //-- ServiceType
    router.get("/getAllServiceTypes", serviceTypeController.getAllServiceTypes)
    router.get("/getServiceTypeById", serviceTypeController.getServiceTypeById)
    //// ----> Admin
    router.get("/admin/getAllServiceTypes", serviceTypeController.getAllServiceTypesAdmin)
    router.get("/admin/getServiceSearch", serviceTypeController.getServiceSearch)
    router.post("/admin/createServiceType", serviceTypeController.createServiceType)
    router.put("/admin/updateServiceType", serviceTypeController.updateServiceType)
    router.put("/admin/blockServiceType", serviceTypeController.blockStatusServiceType)
    router.delete("/admin/deleteServiceType", serviceTypeController.deleteStatusServiceType)

    //-- Room
    router.get("/getRoomById", roomController.getRoomById)
    router.get("/getRoomByDepartment", roomController.getRoomByDepartment)
    //// ----> Admin
    router.get("/admin/getAllRoomAdmin", roomController.getAllRoomAdmin)
    router.post("/admin/createRoom", roomController.createRoom)
    router.put("/admin/updateRoom", roomController.updateRoom)
    router.put("/admin/blockRoom", roomController.blockRoom)
    router.delete("/admin/deleteRoom", roomController.deleteRoom)

    //-- Bed
    router.get("/getAllBeds", bedController.getAllBeds)
    router.get("/getBedById", bedController.getBedById)
    router.get("/getBedByRoom", bedController.getBedByRoom)
    router.get("/getBedEmpty", bedController.getBedEmpty)
    //// ----> Admin
    router.post("/admin/createBed", bedController.createBed)
    router.put("/admin/updateBed", bedController.updateBed)
    router.put("/admin/deleteBed", bedController.deleteBed)

    //-- Patient
    router.get("/getAllPatients", patientController.getAllPatients)
    router.get("/getPatientById", patientController.getPatientById)
    router.get("/getPatientByUserId", patientController.getPatientByUserId)
    //// ----> Admin
    router.post("/admin/createPatient", patientController.createPatient)
    router.put("/admin/updatePatient", patientController.updatePatient)

    //-- Role
    router.get("/getAllRoles", roleController.getAllRoles)
    router.get("/getRoleById", roleController.getRoleById)
    //// ----> Admin
    router.post("/admin/createRole", roleController.createRole)
    router.put("/admin/updateRole", roleController.updateRole)

    //-- Relative
    router.get("/getAllRelatives", relativeController.getAllRelatives)
    router.get("/getRelativeById", relativeController.getRelativeById)
    router.get("/getRelativesByUserId", relativeController.getRelativesByUserId)
    router.post("/createRelative", relativeController.createRelative)
    router.put("/updateRelative", relativeController.updateRelative)
    router.put("/deleteRelative", relativeController.deleteRelative)

    //-- FamilyHistory
    router.get("/getAllFamilyHistories", familyHistoryController.getAllFamilyHistories)
    router.get("/getFamilyHistoryById", familyHistoryController.getFamilyHistoryById)
    router.get("/getFamilyHistoriesByUserId", familyHistoryController.getFamilyHistoriesByUserId)
    router.post("/createFamilyHistory", familyHistoryController.createFamilyHistory)
    router.put("/updateFamilyHistory", familyHistoryController.updateFamilyHistory)
    router.delete("/deleteFamilyHistory", familyHistoryController.deleteFamilyHistory)

    //-- SurgicalHistory
    router.get("/getAllSurgicalHistories", surgicalHistoryController.getAllSurgicalHistories)
    router.get("/getSurgicalHistoryById", surgicalHistoryController.getSurgicalHistoryById)
    // ----> Admin
    router.post("/admin/createSurgicalHistory", surgicalHistoryController.createSurgicalHistory)
    router.put("/admin/updateSurgicalHistory", surgicalHistoryController.updateSurgicalHistory)
    router.put("/admin/deleteSurgicalHistory", surgicalHistoryController.deleteSurgicalHistory)

    //-- SurgicalHistoryUser
    router.get("/getAllSurgicalHistoryUsers", surgicalHistoryUserController.getAllSurgicalHistoryUser)
    router.get("/getSurgicalHistoryUsersByUserId", surgicalHistoryUserController.getSurgicalHistoryUserByUserId)
    router.get("/getSurgicalHistoryUserBySurgicalHistoryId", surgicalHistoryUserController.getSurgicalHistoryUserBySurgicalHistoryId)
    router.post("/createSurgicalHistoryUser", surgicalHistoryUserController.createSurgicalHistoryUser)
    router.put("/updateSurgicalHistoryUser", surgicalHistoryUserController.updateSurgicalHistoryUser)
    router.delete("/deleteSurgicalHistoryUser", surgicalHistoryUserController.deleteSurgicalHistoryUser)

    //-- Disability
    router.get("/getAllDisabilities", disabilityController.getAllDisabilities)
    router.get("/getDisabilityById", disabilityController.getDisabilityById)
    // ----> Admin
    router.post("/admin/createDisability", disabilityController.createDisability)
    router.put("/admin/updateDisability", disabilityController.updateDisability)
    router.put("/admin/deleteDisability", disabilityController.deleteDisability)

    //-- DisabilityUser
    router.get("/getAllDisabilityUsers", disabilityUserController.getAllDisabilityUsers)
    router.get("/getDisabilityUserByUserId", disabilityUserController.getDisabilityUserByUserId)
    router.get("/getDisabilityUserByDisabilityId", disabilityUserController.getDisabilityUserByDisabilityId)
    router.post("/createDisabilityUser", disabilityUserController.createDisabilityUser)
    router.put("/updateDisabilityUser", disabilityUserController.updateDisabilityUser)
    router.delete("/deleteDisabilityUser", disabilityUserController.deleteDisabilityUser)

    //-- Allergy
    router.get("/getAllAllergies", allergyController.getAllAllergies)
    router.get("/getAllergyById", allergyController.getAllergyById)
    // ----> Admin
    router.post("/admin/createAllergy", allergyController.createAllergy)
    router.put("/admin/updateAllergy", allergyController.updateAllergy)
    router.put("/admin/deleteAllergy", allergyController.deleteAllergy)

    //-- AllergyUser
    router.get("/getAllAllergyUsers", allergyUserController.getAllAllergyUsers)
    router.get("/getAllergyUserByUserId", allergyUserController.getAllergyUserByUserId)
    router.get("/getAllergyUserByAllergyId", allergyUserController.getAllergyUserByAllergyId)
    router.post("/createAllergyUser", allergyUserController.createAllergyUser)
    router.put("/updateAllergyUser", allergyUserController.updateAllergyUser)
    router.delete("/deleteAllergyUser", allergyUserController.deleteAllergyUser)

    //-- ConditionAtBirth
    router.get("/getConditionAtBirthById", conditionAtBirthController.getConditionAtBirthById)
    router.get("/getConditionAtBirthByUserId", conditionAtBirthController.getConditionAtBirthByUserId)
    router.post("/createConditionAtBirth", conditionAtBirthController.createConditionAtBirth)
    router.put("/updateConditionAtBirth", conditionAtBirthController.updateConditionAtBirth)
    router.delete("/deleteConditionAtBirth", conditionAtBirthController.deleteConditionAtBirth)

    //-- Insuarance
    router.get("/getInsuaranceById", insuranceController.getInsuranceById)
    router.get("/getInsuaranceByUserId", insuranceController.getInsuranceByUserId)
    router.post("/createInsuarance", insuranceController.createInsurance)
    router.put("/updateInsuarance", insuranceController.updateInsurance)
    router.delete("/deleteInsuarance", insuranceController.deleteInsurance)

    //-- Schedule
    router.get("/getAllSchedules", scheduleController.getAllSchedules)
    router.get("/getScheduleByStaffId", scheduleController.getScheduleByStaffId)
    router.get("/getScheduleInWeek", scheduleController.getScheduleInWeek)
    // ----> Admin
    router.post("/admin/createSchedule", scheduleController.createSchedule)
    router.put("/admin/updateScheduleStaff", scheduleController.updateScheduleStaff)
    router.delete("/admin/deleteSchedule", scheduleController.deleteSchedule)

    //-- Appointment
    router.get("/getAllAppointments", appointmentController.getAllAppointments)
    router.get("/getAllAppointmentsByDate", appointmentController.getAllAppointmentsByDate)
    router.get("/getAppointmentByUserId", appointmentController.getAppointmentByUserId)
    router.get("/getAppointmentByStaffId", appointmentController.getAppointmentByStaffId)
    router.get("/searchAppointment", appointmentController.searchAppointment)
    router.get("/searchAppointmentWithStaffId", appointmentController.seachAppointmentWithStaffId)
    router.post("/createAppointment", appointmentController.createAppointment)
    router.delete("/deleteAppointment", appointmentController.deleteAppointment)

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

    //-- Medicine
    router.get("/getAllMedicines", medicineController.getAllMedicines)
    router.get("/getAllMedicinesForExam", medicineController.getAllMedicinesForExam)
    router.get("/getMedicineById", medicineController.getMedicineById)
    // ----> Admin
    router.post("/admin/createMedicine", medicineController.createMedicine)
    router.put("/admin/updateMedicine", medicineController.updateMedicine)
    router.put("/admin/deleteMedicine", medicineController.deleteMedicine)

    //-- Prescription
    router.get("/getPrescriptionByExaminationId", prescriptionController.getPrescriptionByExaminationId)
    router.post("/upsertPrescription", prescriptionController.upsertPrescription)

    //-- Disease
    router.get("/getDiseaseByName", diseaseController.getDiseaseByName)
    router.get("/getAllDisease", diseaseController.getAllDisease)


   

    return app.use("/api/", router);
}
export default initWebRount;