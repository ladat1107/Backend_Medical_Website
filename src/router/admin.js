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
let initAdminRoute = (app) => {
    router.all("*", checkTokenWithCookie)
    //------> Admin CRUD Specialty
    router.get("/getAllSpecialtyAdmin", specialtyController.getAllSpecialtyAdmin)
    router.post("/createSpecialty", specialtyController.createSpecialty)
    router.put("/updateSpecialty", specialtyController.updateSpecialty)
    router.put("/blockSpecialty", specialtyController.blockSpecialty)
    router.delete("/deleteSpecialty", specialtyController.deleteSpecialty)

    //------> Admin CRUD User
    router.get("/getAllUser", userController.getAllUser)
    router.put("/updateUser", userController.updateUser)
    router.put("/blockUser", userController.blockUser)
    router.delete("/deleteUser", userController.deleteUser)

    ////-----> Admin C.U.D department
    router.get("/getAllDepartment", departmentController.getAllDepartment)
    router.get("/getDepartmentDuty", departmentController.getDepartmentDuty)
    router.post("/createDepartment", departmentController.createDepartment)
    router.put("/updateDepartment", departmentController.updateDepartment)
    router.put("/blockDepartment", departmentController.blockDepartment)
    router.delete("/deleteDepartment", departmentController.deleteDepartment)

    //// ----> Admin
    router.get("/getAllServiceTypes", serviceTypeController.getAllServiceTypesAdmin)
    router.get("/getServiceSearch", serviceTypeController.getServiceSearch)
    router.post("/createServiceType", serviceTypeController.createServiceType)
    router.put("/updateServiceType", serviceTypeController.updateServiceType)
    router.put("/blockServiceType", serviceTypeController.blockStatusServiceType)
    router.delete("/deleteServiceType", serviceTypeController.deleteStatusServiceType)

    //// ----> Admin
    router.get("/getHandbookAdmin", handBookController.getHandBooksAdmin)
    router.put("/updateHandbookStatus", handBookController.updateHandbookStatus)

    //// ----> Admin
    router.get("/getAllRoomAdmin", roomController.getAllRoomAdmin)
    router.post("/createRoom", roomController.createRoom)
    router.put("/updateRoom", roomController.updateRoom)
    router.put("/blockRoom", roomController.blockRoom)
    router.delete("/deleteRoom", roomController.deleteRoom)

    //// ----> Admin
    router.post("/createBed", bedController.createBed)
    router.put("/updateBed", bedController.updateBed)
    router.put("/deleteBed", bedController.deleteBed)

    //// ----> Admin
    router.post("/createPatient", patientController.createPatient)
    router.put("/updatePatient", patientController.updatePatient)

    //// ----> Admin
    router.post("/createRole", roleController.createRole)
    router.put("/updateRole", roleController.updateRole)

    // ----> Admin
    router.post("/arrangSchedule", scheduleController.arrangSchedule)
    router.post("/createSchedule", scheduleController.createSchedule)
    router.get("/getAllSchedules", scheduleController.getAllSchedulesAdmin)
    router.put("/updateScheduleStaff", scheduleController.updateScheduleStaff)
    router.delete("/deleteSchedule", scheduleController.deleteSchedule)

    // ----> Admin
    router.post("/createMedicine", medicineController.createMedicine)
    router.put("/updateMedicine", medicineController.updateMedicine)
    router.put("/deleteMedicine", medicineController.deleteMedicine)

    // ----> Admin
    router.post("/createAllergy", allergyController.createAllergy)
    router.put("/updateAllergy", allergyController.updateAllergy)
    router.put("/deleteAllergy", allergyController.deleteAllergy)
    // ----> Admin
    router.post("/createDisability", disabilityController.createDisability)
    router.put("/updateDisability", disabilityController.updateDisability)
    router.put("/deleteDisability", disabilityController.deleteDisability)

    router.post("/createSurgicalHistory", surgicalHistoryController.createSurgicalHistory)
    router.put("/updateSurgicalHistory", surgicalHistoryController.updateSurgicalHistory)
    router.put("/deleteSurgicalHistory", surgicalHistoryController.deleteSurgicalHistory)

    return app.use("/api/admin/", router);
}
export default initAdminRoute;