import express from 'express';
import userController from '../controllers/userController';
import departmentController from '../controllers/departmentController';
import staffController from '../controllers/staffController';
import handBookController from '../controllers/handBookController'; 
import roomTypeController from '../controllers/roomTypeController';
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
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();
import db from "../models/index";

let router = express.Router();
let initWebRount = (app) => {
    //router.all("*", checkTokenWithCookie, checkAuthentication)
    // app.post('/users', async (req, res) => {
    //     try {
    //         // Lấy dữ liệu từ body của request
    //         const {
    //             id,
    //             userName, password, lastName, firstName, email, cid, address,
    //             currentResident, dob, phoneNumber, avatar, status, folk, nationality,
    //             ABOBloodGroup, RHBloodGroup, maritalStatus, roleId, point
    //         } = req.body;
    //         console.log("CHECK REQ:", req.body)
    //         // Chèn dữ liệu vào bảng users
    //         const newUser = await db.User.create({
    //             id,
    //             userName,
    //             password,
    //             lastName,
    //             firstName,
    //             email,
    //             cid,
    //             address,
    //             currentResident,
    //             dob,
    //             phoneNumber,
    //             avatar,
    //             status,
    //             folk,
    //             nationality,
    //             ABOBloodGroup,
    //             RHBloodGroup,
    //             maritalStatus,
    //             roleId,
    //             point
    //         });

    //         // Trả về user vừa được tạo
    //         res.status(201).json(newUser);
    //     } catch (error) {
    //         // Bắt lỗi và trả về lỗi
    //         console.error('Error inserting user:', error);
    //         res.status(500).json({ error: 'Đã có lỗi xảy ra khi chèn user' });
    //     }
    // });

    router.post("/registerUser", userController.handleRegisterUser)
    router.post("/handleLogin", userController.handleLogin)
    router.post("/handleLogout", userController.handleLogout)

    router.get("/account", userController.handleGetAccount)
    router.get("/user/get", userController.getFunction)
    router.get("/user/getById", userController.getFunctionById)
    //router.post("/user/create", userController.createFunction)
    router.put("/user/update", userController.updateFunction)
    router.delete("/user/delete", userController.deleteFunction)

    //-- User
    router.get("/getUserById", userController.getUserById)
    //------> Admin CRUD User
    router.get("/admin/getAllUser", userController.getAllUser)
    router.post("/admin/createUser", userController.createUser)
    router.put("/admin/updateUser", userController.updateUser)
    router.put("/admin/deleteUser", userController.deleteUser)

    //-- Department
    router.get("/getAllDepartment", departmentController.getAllDepartment)
    router.get("/getDepartmentById", departmentController.getDepartmentById)
    router.get("/getAllStaffInDepartment", departmentController.getAllStaffInDepartment)
    ////-----> Admin C.U.D department
    router.post("/admin/createDepartment", departmentController.createDepartment)
    router.put("/admin/updateDepartment", departmentController.updateDepartment)
    router.put("/admin/deleteDepartment", departmentController.deleteDepartment)

    //-- Staff
    router.get("/getAllStaff", staffController.getAllStaff)
    router.get("/getStaffById", staffController.getStaffById)
    router.get("/getStaffbyDepartmentId", staffController.getStaffbyDepartmentId)
    router.get("/getStaffByRole", staffController.getStaffByRole)

    //--  HandBook
    router.get("/getAllHandBooks", handBookController.getAllHandBooks)
    router.get("/getHandBookById", handBookController.getHandBookById)
    router.post("/createHandBook", handBookController.createHandBook)
    router.put("/updateHandBook", handBookController.updateHandBook)
    //// ----> Admin
    router.get("/admin/getHandBooksByStatus", handBookController.getHandBooksByStatus)
    router.put("/admin/updateHandbookStatus", handBookController.updateHandbookStatus)

    //-- RoomType
    router.get("/getAllRoomTypes", roomTypeController.getAllRoomTypes)
    router.get("/getRoomTypeById", roomTypeController.getRoomTypeById)
    //// ----> Admin
    router.post("/admin/createRoomType", roomTypeController.createRoomType)
    router.put("/admin/updateRoomType", roomTypeController.updateRoomType)
    router.put("/admin/updateStatusRoomType", roomTypeController.updateStatusRoomType)

    //-- Room
    router.get("/getAllRooms", roomController.getAllRooms)
    router.get("/getRoomById", roomController.getRoomById)
    router.get("/getRoomByDepartment", roomController.getRoomByDepartment)
    //// ----> Admin
    router.post("/admin/createRoom", roomController.createRoom)
    router.put("/admin/updateRoom", roomController.updateRoom)
    router.put("/admin/updateStatusRoom", roomController.updateStatusRoom)

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

    return app.use("/api/", router);
}
export default initWebRount;