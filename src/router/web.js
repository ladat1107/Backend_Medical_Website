import express from 'express';

import { getDistrict, getFolk, getProvince } from '../services/addressService';
import { generalNumber, generalNumberCurrent, getTickets } from '../services/ticketService';
import { getSpcialtyHomeController, getSpecialtiesByDepartmentController, getSpecialtiesByLaboratoryController, getSpecialtyByIdController, getSpecialtySelectController } from '../controllers/specialtyController';
import { getAllDepartmentController, getAllNameDepartmentController, getAllStaffInDepartmentController, getDepartmentByIdController, getDepartmentHomeController } from '../controllers/departmentController';
import { getHandBookByIdController, getHandBookHomeController } from '../controllers/handBookController';
import { getScheduleApoinmentController } from '../controllers/examinationController';
import { getServiceHome } from '../utils/data/dataService';
import { createUserController, getDoctorHomeController, getUserByCidController, getUserByIdController, getUserByQrCodeController, getUserInsuaranceController, profilePasswordController } from '../controllers/userController';
import { getAllStaffController, getStaffByIdController, getStaffByNameController, getStaffByRoleController, profileStaffController } from '../controllers/staffController';
import { getAllServiceTypesController, getServiceLaboratoryController, getServiceTypeByIdController } from '../controllers/serviceTypeController';
import { getRoomByDepartmentController, getRoomByIdController } from '../controllers/roomController';
import { createRelativeController, deleteRelativeController, getAllRelativesController, getRelativeByIdController, getRelativesByUserIdController, updateRelativeController } from '../controllers/relativeController';
import { createInsuranceController, deleteInsuranceController, getInsuranceByIdController, getInsuranceByUserIdController, updateInsuranceController } from '../controllers/insuranceController';
import { messageSystem } from '../controllers/messageController';
//import { sendNotification } from '../services/socketService';
import dotenv from 'dotenv';
dotenv.config();

let router = express.Router();
let initWebRounte = (app) => {

    //------> Specialty
    router.get("/getSpcialtyHome", getSpcialtyHomeController)

    // DEPARTMENT
    router.get("/getDepartmenHome", getDepartmentHomeController);

    // HANDBOOK
    router.get("/getHandBookHome", getHandBookHomeController);
    router.get("/getHandBookById", getHandBookByIdController);

    //EXAMINATION
    router.get("/getScheduleApoinment", getScheduleApoinmentController);

    //FOLK
    router.get("/getFolk", getFolk);
    router.get("/getProvince", getProvince);
    router.get("/getDistrict", getDistrict);

    //SECTION
    router.get("/getServicesHome", getServiceHome);

    router.get("/getSpecialtySelect", getSpecialtySelectController)
    router.get("/getSpecialtyById", getSpecialtyByIdController)

    //-- User   

    router.get("/getUserById", getUserByIdController)
    router.get("/getUserByCid", getUserByCidController)
    router.get("/getDoctorHome", getDoctorHomeController);
    router.put("/profileUpdatePassword", profilePasswordController)
    router.get("/getUserInsuarance", getUserInsuaranceController)

    //-- Department
    router.get("/getAllNameDepartment", getAllNameDepartmentController)
    router.get("/getDepartmentById", getDepartmentByIdController)
    router.get("/getAllStaffInDepartment", getAllStaffInDepartmentController)
    router.get("/getAllDepartment", getAllDepartmentController)

    //-- Message
    router.post("/messageSystem", messageSystem)

    //-- Staff
    router.get("/getAllStaff", getAllStaffController)
    router.get("/getStaffById", getStaffByIdController)
    // router.get("/getStaffbyDepartmentId", getStaffbyDepartmentId)
    router.get("/getStaffByRole", getStaffByRoleController)
    router.get("/getStaffByName", getStaffByNameController)


    router.put("/profileUpdateStaff", profileStaffController)

    //-- ServiceType
    router.get("/getAllServiceTypes", getAllServiceTypesController)
    router.get("/getServiceTypeById", getServiceTypeByIdController)

    //-- Room
    router.get("/getRoomById", getRoomByIdController)
    router.get("/getRoomByDepartment", getRoomByDepartmentController)

    //-- Relative
    router.get("/getAllRelatives", getAllRelativesController)
    router.get("/getRelativeById", getRelativeByIdController)
    router.get("/getRelativesByUserId", getRelativesByUserIdController)
    router.post("/createRelative", createRelativeController)
    router.put("/updateRelative", updateRelativeController)
    router.delete("/deleteRelative", deleteRelativeController)

    //-- Insuarance
    router.get("/getInsuaranceById", getInsuranceByIdController)
    router.get("/getInsuaranceByUserId", getInsuranceByUserIdController)
    router.post("/createInsuarance", createInsuranceController)
    router.put("/updateInsuarance", updateInsuranceController)
    router.delete("/deleteInsuarance", deleteInsuranceController)

    //-- Create User
    router.post("/createUser", createUserController)

    router.get("/getSpecialtiesByDepartment", getSpecialtiesByDepartmentController)
    router.get("/getSpecialtiesByLaboratory", getSpecialtiesByLaboratoryController)
    router.get("/getServiceLaboratory", getServiceLaboratoryController)
    router.get("/getUserByQrCode", getUserByQrCodeController)

   
    router.get("/getCurrentNumber", getTickets)
    router.put("/generateNumber", generalNumber)
    router.put("/generateNumberCurrent", generalNumberCurrent)


    return app.use("/api/", router);
}
export default initWebRounte;