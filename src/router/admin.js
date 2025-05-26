import express from 'express';

import { checkTokenWithCookie } from "../Middleware/JWTAction";
import { getStatisticalAppoinment } from '../services/statisticalService';
import { blockSpecialtyController, createSpecialtyController, deleteSpecialtyController, getAllSpecialtyAdminController, updateSpecialtyController } from '../controllers/specialtyController';
import { blockUserController, deleteUserController, getAllUserController, updateUserController } from '../controllers/userController';
import { blockDepartmentController, createDepartmentController, deleteDepartmentController, getAllDepartmentController, getDepartmentDutyController, updateDepartmentController } from '../controllers/departmentController';
import { blockStatusServiceTypeController, createServiceTypeController, deleteStatusServiceTypeController, getAllServiceTypesAdminController, getServiceSearchController, updateServiceTypeController } from '../controllers/serviceTypeController';
import { getHandBooksAdminController, updateHandbookStatusController } from '../controllers/handBookController';
import { blockRoomController, createRoomController, deleteRoomController, getAllRoomAdminController, updateRoomController } from '../controllers/roomController';
import { arrangScheduleController, createScheduleController, deleteScheduleController, getAllSchedulesAdminController, updateScheduleStaffController } from '../controllers/scheduleController';
import { blockMedicineController, createMedicineController, deleteMedicineController, getAllMedicinesAdminController, getPrescriptionUsedController, updateMedicineController } from '../controllers/medicineController';
import { getAllExaminationsAdminController, getExaminationByIdAdminController } from '../controllers/examinationController';
import { getPaymentAdminController } from '../controllers/paymentController';
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

    //// ----> Admin room
    router.get("/getAllRoomAdmin", getAllRoomAdminController)
    router.post("/createRoom", createRoomController)
    router.put("/updateRoom", updateRoomController)
    router.put("/blockRoom", blockRoomController)
    router.delete("/deleteRoom", deleteRoomController)

    // ----> Admin
    router.post("/arrangSchedule", arrangScheduleController)
    router.post("/createSchedule", createScheduleController)
    router.get("/getAllSchedules", getAllSchedulesAdminController)
    router.put("/updateScheduleStaff", updateScheduleStaffController)
    router.delete("/deleteSchedule", deleteScheduleController)

    // ----> Admin statistical
    router.get("/getStatisticalAppoinment", getStatisticalAppoinment)


    // ----> Admin Medicine
    router.get("/getAllMedicinesAdmin", getAllMedicinesAdminController)
    router.get("/getPrescriptionUsed", getPrescriptionUsedController)
    router.post("/createMedicine", createMedicineController)
    router.put("/updateMedicineAdmin", updateMedicineController)
    router.put("/blockMedicine", blockMedicineController)
    router.delete("/deleteMedicine", deleteMedicineController)

    // ----> Admin Examination
    router.get("/getAllExaminationsAdmin", getAllExaminationsAdminController)
    router.get("/getExaminationByIdAdmin", getExaminationByIdAdminController)

    // ----> Admin Payment
    router.get("/getPaymentAdmin", getPaymentAdminController)

    return app.use("/api/admin/", router);
}
export default initAdminRoute;