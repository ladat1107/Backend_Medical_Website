import express from 'express';
import userController from '../controllers/userController';
import departmentController from '../controllers/departmentController';
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

    return app.use("/api/", router);
}
export default initWebRount;