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
import { getServiceHome } from "../utils/data/dataService"
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();

let router = express.Router();
let initWebRount = (app) => {
    // router.all("*", checkTokenWithCookie)

    //------> Specialty
    router.get("/getSpcialtyHome", specialtyController.getSpcialtyHome)

    // DEPARTMENT
    router.get("/getDepartmenHome", departmentController.getDepartmentHome);

    // HANDBOOK
    router.get("/getHandBookHome", handBookController.getHandBookHome);
    router.get("/getHandBookByDeparment", handBookController.getHandBookDeparment);

    //USER

    //SECTION
    router.get("/getServicesHome", getServiceHome);

    router.get("/getSpecialtySelect", specialtyController.getSpecialtySelect)
    router.get("/getSpecialtyById", specialtyController.getSpecialtyById)

    //-- User   
    router.get("/getUserById", userController.getUserById)
    router.get("/getUserByCid", userController.getUserByCid)    
    router.get("/getDoctorHome", userController.getDoctorHome);
    router.put("/profileUpdateInfo", userController.profileInfor)
    router.put("/profileUpdatePassword", userController.profilePassword)

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


    //-- ServiceType
    router.get("/getAllServiceTypes", serviceTypeController.getAllServiceTypes)
    router.get("/getServiceTypeById", serviceTypeController.getServiceTypeById)

    //-- Room
    router.get("/getRoomById", roomController.getRoomById)
    router.get("/getRoomByDepartment", roomController.getRoomByDepartment)

    //-- Bed
    router.get("/getAllBeds", bedController.getAllBeds)
    router.get("/getBedById", bedController.getBedById)
    router.get("/getBedByRoom", bedController.getBedByRoom)
    router.get("/getBedEmpty", bedController.getBedEmpty)

    //-- Patient
    router.get("/getAllPatients", patientController.getAllPatients)
    router.get("/getPatientById", patientController.getPatientById)
    router.get("/getPatientByUserId", patientController.getPatientByUserId)

    //-- Role
    router.get("/getAllRoles", roleController.getAllRoles)
    router.get("/getRoleById", roleController.getRoleById)

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

    return app.use("/api/", router);
}
export default initWebRount;