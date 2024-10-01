import db from "../models/index";
import bcrypt from "bcrypt";
import { Op, where } from 'sequelize';
import JWTService from "../services/JWTService";
import { sendEmailConform } from "../services/emailService";
import { createToken, verifyToken } from "../Middleware/JWTAction"
import { status } from "../utils/index";
import staffService from "./staffService";
import { PAGINATE } from "../utils/constraints";

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

const getAllUser = async (page, limit, search, position) => {
    try {
        if (position.length == 0) {
            position = [3, 4, 5, 6, 7];
        }
        let users = await db.User.findAndCountAll({
            where: {
                roleId: {
                    [Op.in]: position
                },
                status: status.ACTIVE,
                [Op.or]: [
                    { firstName: { [Op.like]: `%${search}%` } },
                    { lastName: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phoneNumber: { [Op.like]: `%${search}%` } },
                    { cid: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                    { currentResident: { [Op.like]: `%${search}%` } },
                    { dob: { [Op.like]: `%${search}%` } },
                ]
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: db.Role, as: "userRoleData", attributes: ["id", "name"]
                }
            ],
            offset: (+page - 1) * +limit,
            limit: limit,
            attributes: ["id", "email", "phoneNumber", "lastName", "firstName",
                "cid", "dob", "address", "currentResident", "gender", "avatar", "folk", "ABOBloodGroup",
                "RHBloodGroup", "maritalStatus", "roleId", "point", "status"],
            raw: true,
            nest: true,
        });
        console.log(users);
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
            attributes: ["id", "email", "phoneNumber", "lastName", "firstName",
                "cid", "dob", "address", "currentResident", "gender", "avatar", "folk", "ABOBloodGroup",
                "RHBloodGroup", "maritalStatus", "roleId", "point"],
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
    try {
        if (!await checkEmail(data.email)) {
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
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
        });
        if (user) {
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
            if (staff) {
                return {
                    EC: 0,
                    EM: "Cập nhật tài khoản thành công",
                    DT: "",
                }
            } else {
                return {
                    EC: 200,
                    EM: "Cập nhật tài khoản thất bại",
                    DT: "",
                }
            }
        } else {
            return {
                EC: 200,
                EM: "Không tìm thấy tài khoản",
                DT: "",
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server user",
            DT: "",
        }
    }
}

const deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (user) {
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
    } catch (error) {
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
        let passwordHash = await hashPasswordUser(data.password)
        sendEmailConform({ ...data, password: passwordHash });
        return {
            EC: 0,
            EM: "Đăng ký thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}
const confirmUser = async (token) => {
    try {
        let data = await verifyToken(token);

        if (data) {
            console.log("gửi mail thành công");
            if (await checkEmail(data.email) == false) {
                return {
                    EC: 200,
                    EM: "Bạn đã đăng ký tài khoản này",
                    DT: "",
                }
            }
            let user = await db.User.create({
                email: data.email,
                password: data.password,
                lastName: data.lastName,
                firstName: data.firstName,
                phoneNumber: data.phoneNumber,
                cid: data.cid,
                currentResident: data.currentResident,
                dob: data.dob,
                folk: data.folk,
                point: 0,
                roleId: 1,
                status: 1,
            })
            if (user) {
                return {
                    EC: 0,
                    EM: "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ",
                    DT: "",
                }
            } else {
                return {
                    EC: 200,
                    EM: "Đăng ký thất bại",
                    DT: "",
                }
            }
        }
        return {
            EC: 200,
            EM: "Token không hợp lệ",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
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
                ]
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })
        if (user) {
            let comparePassword = await bcrypt.compareSync(data.passwordLogin, user.password);
            if (comparePassword) {
                delete user.dataValues.password;
                let data = {
                    email: user.email,
                    userName: user.userName,
                    roleId: user.roleId,
                }
                let token = createToken(data);
                return {
                    EC: 0,
                    EM: "Đăng nhập thành công",
                    DT: {
                        user: user,
                        token: token,
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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
            EM: "Lỗi hệ thống",
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