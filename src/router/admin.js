import express from 'express';

import { checkTokenWithCookie } from "../Middleware/JWTAction";
import { getStatisticalAppoinment } from '../services/statisticalService';
import { blockSpecialtyController, createSpecialtyController, deleteSpecialtyController, getAllSpecialtyAdminController, updateSpecialtyController } from '../controllers/specialtyController';
import { blockUserController, deleteUserController, getAllUserController, updateUserController } from '../controllers/userController';
import { blockDepartmentController, createDepartmentController, deleteDepartmentController, getAllDepartmentController, getDepartmentDutyController, updateDepartmentController } from '../controllers/departmentController';
import { blockStatusServiceTypeController, createServiceTypeController, deleteStatusServiceTypeController, getAllServiceTypesAdminController, getServiceSearchController, updateServiceTypeController } from '../controllers/serviceTypeController';
import { getHandBooksAdminController, updateHandbookStatusController } from '../controllers/handBookController';
import { blockRoomController, createRoomController, deleteRoomController, getAllRoomAdminController, updateRoomController } from '../controllers/roomController';
import { createBedController, deleteBedController, updateBedController } from '../controllers/bedController';
import { createPatientController, updatePatientController } from '../controllers/patientController';
import { createRoleController, updateRoleController } from '../controllers/roleController';
import { arrangScheduleController, createScheduleController, deleteScheduleController, getAllSchedulesAdminController, updateScheduleStaffController } from '../controllers/scheduleController';
import { createMedicineController, deleteMedicineController, updateMedicineController } from '../controllers/medicineController';
import { createAllergyController, deleteAllergyController, updateAllergyController } from '../controllers/allergyController';
import { createDisabilityController, deleteDisabilityController, updateDisabilityController } from '../controllers/disabilityController';
import { createSurgicalHistoryController, deleteSurgicalHistoryController, updateSurgicalHistoryController } from '../controllers/surgicalHistoryController';
require('dotenv').config();

let router = express.Router();
let initAdminRoute = (app) => {
    router.all("*", checkTokenWithCookie)
    //------> Admin CRUD Specialty
    router.get("/getAllSpecialtyAdmin", getAllSpecialtyAdminController)
    router.post("/createSpecialty", createSpecialtyController)
    router.put("/updateSpecialty", updateSpecialtyController)
    router.put("/blockSpecialty", blockSpecialtyController)
    router.delete("/deleteSpecialty", deleteSpecialtyController)

    //------> Admin CRUD User
    router.get("/getAllUser", getAllUserController)
    router.put("/updateUser", updateUserController)
    router.put("/blockUser", blockUserController)
    router.delete("/deleteUser", deleteUserController)

    ////-----> Admin C.U.D department
    router.get("/getAllDepartment", getAllDepartmentController)
    router.get("/getDepartmentDuty", getDepartmentDutyController)
    router.post("/createDepartment", createDepartmentController)
    router.put("/updateDepartment", updateDepartmentController)
    router.put("/blockDepartment", blockDepartmentController)
    router.delete("/deleteDepartment", deleteDepartmentController)

    //// ----> Admin
    router.get("/getAllServiceTypes", getAllServiceTypesAdminController)
    router.get("/getServiceSearch", getServiceSearchController)
    router.post("/createServiceType", createServiceTypeController)
    router.put("/updateServiceType", updateServiceTypeController)
    router.put("/blockServiceType", blockStatusServiceTypeController)
    router.delete("/deleteServiceType", deleteStatusServiceTypeController)

    //// ----> Admin
    router.get("/getHandbookAdmin", getHandBooksAdminController)
    router.put("/updateHandbookStatus", updateHandbookStatusController)

    //// ----> Admin
    router.get("/getAllRoomAdmin", getAllRoomAdminController)
    router.post("/createRoom", createRoomController)
    router.put("/updateRoom", updateRoomController)
    router.put("/blockRoom", blockRoomController)
    router.delete("/deleteRoom", deleteRoomController)

    //// ----> Admin
    router.post("/createBed", createBedController)
    router.put("/updateBed", updateBedController)
    router.put("/deleteBed", deleteBedController)

    //// ----> Admin
    router.post("/createPatient", createPatientController)
    router.put("/updatePatient", updatePatientController)

    //// ----> Admin Role
    router.post("/createRole", createRoleController)
    router.put("/updateRole", updateRoleController)

    // ----> Admin
    router.post("/arrangSchedule", arrangScheduleController)
    router.post("/createSchedule", createScheduleController)
    router.get("/getAllSchedules", getAllSchedulesAdminController)
    router.put("/updateScheduleStaff", updateScheduleStaffController)
    router.delete("/deleteSchedule", deleteScheduleController)

    // ----> Admin statistical 
    router.get("/getStatisticalAppoinment", getStatisticalAppoinment)

    //----------------------------------------------------------------------------------------------------------------------------------------
    // ----> Admin
    router.post("/createMedicine", createMedicineController)
    router.put("/updateMedicine", updateMedicineController)
    router.put("/deleteMedicine", deleteMedicineController)

    // ----> Admin
    router.post("/createAllergy", createAllergyController)
    router.put("/updateAllergy", updateAllergyController)
    router.put("/deleteAllergy", deleteAllergyController)
    // ----> Admin
    router.post("/createDisability", createDisabilityController)
    router.put("/updateDisability", updateDisabilityController)
    router.put("/deleteDisability", deleteDisabilityController)

    router.post("/createSurgicalHistory", createSurgicalHistoryController)
    router.put("/updateSurgicalHistory", updateSurgicalHistoryController)
    router.put("/deleteSurgicalHistory", deleteSurgicalHistoryController)

    return app.use("/api/admin/", router);
}
export default initAdminRoute;