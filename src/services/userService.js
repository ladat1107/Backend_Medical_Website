import db from "../models/index";
import bcrypt from "bcrypt";
import { Op, where } from 'sequelize';
import JWTService from "../services/JWTService";
import { createToken, verifyToken } from "../Middleware/JWTAction"
import { status } from "../utils/index";
import staffService from "./staffService";

const salt = bcrypt.genSaltSync(10);
require('dotenv').config();
let hashPasswordUser = async (password) => {
    try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    } catch (e) {
        console.log(e);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
        }
    }
}
const checkEmail = async (email) => {
    try {
        let user = await db.User.findOne({
            where: { email: email }
        });

        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const checkPhoneNumber = async (phoneNumber) => {
    try {
        let user = await db.User.findOne({ where: { phoneNumber: phoneNumber } });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const checkCid = async (cid) => {
    try {
        let user = await db.User.findOne({ where: { cid: cid } });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người dùng thành công",
            DT: users
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const getUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId, status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        if (user) {
            return {
                EC: 0,
                EM: "Lấy thông tin người dùng thành công",
                DT: user
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const createUser = async (data) => {
    try{
        if(!await checkEmail(data.email)){
            return {
                EC: 200,
                EM: "Người dùng đã tồn tại",
                DT: "",
            }
        }

        let hashPassword = await hashPasswordUser(data.password);
        let user = await db.User.create({
            email: data.email,
            password: hashPassword,
            phoneNumber: data.phoneNumber,
            lastName: data.lastName,
            firstName: data.firstName,
            cid: data.cid,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            currentRescident: data.currentRescident,
            status: status.ACTIVE,
            roleId: data.roleId
        });

        const staff = await staffService.createStaff(data, user.id);
        
        if (user && staff) {
            return {
                EC: 0,
                EM: "Tạo tài khoản thành công",
                DT: "",
            }
        } else {
            return {
                EC: 200,
                EM: "Tạo tài khoản thất bại",
                DT: "",
            }
        }
    }catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateUser = async (data) => {
    try{
        let user = await db.User.findOne({
            where: { id: data.id },
        });
        if(user){
            await user.update({
                email: data.email,
                phoneNumber: data.phoneNumber,
                lastName: data.lastName,
                firstName: data.firstName,
                cid: data.cid,
                dob: data.dob,
                gender: data.gender,
                address: data.address,
                currentRescident: data.currentRescident,
                roleId: data.roleId
            });
            const staff = await staffService.updateStaff(data, user.id);
            if(staff){
                return {
                    EC: 0,
                    EM: "Cập nhật tài khoản thành công",
                    DT: "",
                }
            } else{
                return {
                    EC: 200,
                    EM: "Cập nhật tài khoản thất bại",
                    DT: "",
                }
            }
        } else{
            return {
                EC: 200,
                EM: "Không tìm thấy tài khoản",
                DT: "",
            }
        }
    } catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server user",
            DT: "",
        }
    }
}

const deleteUser = async (userId) => {
    try{
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if(user){
            await user.update({
                status: status.INACTIVE,
            });
            return {
                EC: 0,
                EM: `Xóa người dùng ${user.userName} thành công`,
                DT: "",
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch(error){
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const registerUser = async (data) => {
    try {
        if (await checkEmail(data.email) == false) {
            return {
                EC: 200,
                EM: "Email đã tồn tại",
                DT: "",
            }
        }
        if (await checkPhoneNumber(data.phoneNumber) == false) {
            return {
                EC: 200,
                EM: "Số điện thoại đã tồn tại",
                DT: "",
            }
        }
        let passwordHash = await hashPasswordUser(data.password)
        console.log("check passwordHash:", passwordHash);
        let user = await db.User.create({
            email: data.email,
            password: passwordHash,
            userName: data.userName,
            phoneNumber: data.phoneNumber,
            groupId: 1,
        })
        if (user) {
            return {
                EC: 0,
                EM: "Đăng ký thành công",
                DT: "",
            }
        } else {
            return {
                EC: 200,
                EM: "Đăng ký thất bại",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const loginUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: data.userLogin },
                    { phoneNumber: data.userLogin }
                ]
            }
        })
        if (user) {
            let comparePassword = await bcrypt.compareSync(data.passwordLogin, user.password);
            if (comparePassword) {
                delete user["password"];
                let groupRole = await JWTService.getGroupWithRole(user);
                let data = {
                    email: user.email,
                    groupRole,
                    userName: user.userName,
                }
                let token = createToken(data);
                return {
                    EC: 0,
                    EM: "Đăng nhập thành công",
                    DT: {
                        email: user.email,
                        userName: user.userName,
                        token: token,
                        groupRole
                    }
                }
            }
        }
        return {
            EC: 200,
            EM: "Tên đăng nhập hoặc mật khẩu không đúng",
            DT: ''
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
const getFunction = async (page, limit) => {
    try {
        let { count, rows } = await db.User.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: db.Group, as: "userGroup", attributes: ["name"]
                }
            ],
            raw: true,
            nest: true,
            offset: (+page - 1) * +limit,
            limit: limit,
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRecords: count,
            users: rows
        }
        return {
            EC: 0,
            EM: "Lấy danh sách thành công",
            DT: data
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}
const deleteFunction = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (user) {
            await db.User.destroy({
                where: { id: user.id }
            });
            return {
                EC: 0,
                EM: `Xóa người dùng ${user.userName} thành công`,
                DT: "",
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}

const createFunction = async (data) => {
    try {
        if (await checkEmail(data.email) == false) {
            return {
                EC: 200,
                EM: "Email đã tồn tại",
                DT: "",
            }
        }
        if (await checkPhoneNumber(data.phoneNumber) == false) {
            return {
                EC: 200,
                EM: "Số điện thoại đã tồn tại",
                DT: "",
            }
        }
        let passwordHash = await hashPasswordUser(data.password)
        let user = await db.User.create({
            email: data.email,
            password: passwordHash,
            userName: data.userName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            groupId: data.groupId,
            gender: +data.gender,
        })
        if (user) {
            return {
                EC: 0,
                EM: "Tạo mới người dùng thành công",
                DT: "",
            }
        } else {
            return {
                EC: 200,
                EM: "Tạo người thất bại",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}
const updateExisted = async (email, phone, userId) => {
    let userCheck = await db.User.findAll({
        where: {
            [Op.or]: [
                { email: email },
                { phoneNumber: phone }
            ]
        }
    })
    for (let i = 0; i < userCheck.length; i++) {
        if (userCheck[i].id != userId) {
            return true;
        }
    }
    return false;
}
const updateFunction = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
        });

        if (user) {
            if (await updateExisted(data.email, data.phoneNumber, user.id) == true) {
                return {
                    EC: 200,
                    EM: "Email hoặc số điện thoại đã tồn tại với người dùng khác",
                    DT: "",
                }
            } else {
                await db.User.update({
                    email: data.email,
                    userName: data.userName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    groupId: data.groupId,
                    gender: +data.gender,
                }, {
                    where: { id: user.id }
                })

                return {
                    EC: 0,
                    EM: "Cập nhật người dùng thành công",
                    DT: "",
                }
            }
        }
        return {
            EC: 200,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}
const getFunctionById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: db.Group, as: "userGroup", attributes: ["name"]
                }
            ],
            raw: true,
            nest: true,
        });
        if (user) {
            return {
                EC: 0,
                EM: "Lấy thông tin người dùng thành công",
                DT: user
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy người dùng",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}
module.exports = {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    // getFunction,
    // deleteFunction,
    // createFunction,
    // updateFunction,
    // getFunctionById,
}