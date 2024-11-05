import db from "../models/index";
import { status } from "../utils/index";
import descriptionService from "./descriptionService";
const { Op } = require('sequelize');

const getAllStaff = async () => {
    try {
        let staff = await db.Staff.findAll({
            where: { status: status.ACTIVE },
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: ['id', 'email', 'phoneNumber', 'lastName', 'firstName', 'cid', 'dob', 'currentResident', 'gender', 'avatar'],
                include: [{
                    model: db.Role,
                    as: 'userRoleData',
                    attributes: ['name']
                }],
            }, {
                model: db.Department,
                as: 'staffDepartmentData',
                attributes: ['name']
            }, {
                model: db.Description,
                as: 'staffDescriptionData',
                attributes: ['markDownContent', 'htmlContent']
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staff
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

const getStaffbyDepartmentId = async (departmentId) => {
    try {
        let staffs = await db.Staff.findAll({
            where: { id: departmentId },
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: ['id', 'email', 'phoneNumber', 'lastName', 'firstName', 'cid', 'dob', 'currentResident', 'gender', 'avatar'],
                include: [{
                    model: db.Role,
                    as: 'userRoleData',
                    attributes: ['name']
                }],
            }, {
                model: db.Department,
                as: 'staffDepartmentData',
                attributes: ['name']
            }, {
                model: db.Description,
                as: 'staffDescriptionData',
                attributes: ['markDownContent', 'htmlContent']
            }],
            raw: true,
            nest: true,
        });
        if (staffs) {
            return {
                EC: 0,
                EM: "Lấy thông tin nhân viên trong khoa thành công",
                DT: staffs
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy nhân viên",
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

const getStaffById = async (staffId) => {
    try {
        let staff = await db.Staff.findOne({
            where: { id: staffId },
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: ['id', 'email', 'phoneNumber', 'lastName', 'firstName', 'cid', 'dob', 'currentResident', 'gender', 'avatar'],
                include: [{
                    model: db.Role,
                    as: 'userRoleData',
                    attributes: ['name']
                }],
            }, {
                model: db.Department,
                as: 'staffDepartmentData',
                attributes: ['name']
            }, {
                model: db.Description,
                as: 'staffDescriptionData',
                attributes: ['markDownContent', 'htmlContent']
            }],
            raw: true,
            nest: true,
        });
        if (staff) {
            return {
                EC: 0,
                EM: "Lấy thông tin nhân viên thành công",
                DT: staff
            }
        }
        return {
            EC: 404,
            EM: "Không tìm thấy nhân viên",
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

const getStaffByRole = async (roleId) => {
    try {
        let staff = await db.Staff.findAll({
            where: { status: status.ACTIVE }, // Chỉ lấy nhân viên active
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: [
                    'id', 'email', 'phoneNumber', 'lastName', 'firstName',
                    'cid', 'dob', 'currentResident', 'gender', 'avatar'
                ],
                include: [{
                    model: db.Role,
                    as: 'userRoleData',
                    attributes: ['id', 'name'],
                    where: { id: roleId }, // Chỉ lấy những user có roleId khớp
                }],
                required: true, // Bắt buộc phải có role
            }, {
                model: db.Department,
                as: 'staffDepartmentData',
                attributes: ['name']
            }, {
                model: db.Description,
                as: 'staffDescriptionData',
                attributes: ['markDownContent', 'htmlContent']
            }]
        });

        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staff
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

const getStaffByName = async (name) => {
    try {
        if (!name) name = ""
        let staff = await db.Staff.findAll({
            where: {
                status: status.ACTIVE
            },
            attributes: ['id'],
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: ['id', 'lastName', 'firstName'],
                where: {
                    [Op.or]: [
                        { lastName: { [Op.like]: `%${name}%` } },
                        { firstName: { [Op.like]: `%${name}%` } }
                    ]
                }
            }],
            raw: true,
            nest: true
        });
        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staff
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

const createStaff = async (data, userId) => {
    try {
        let positionInsert = ""
        if (data.position) {
            positionInsert = data.position.toString();
        }
        console.log("check data", positionInsert);

        let descriptionId = await descriptionService.createDescription(data);
        if (descriptionId) {
            await db.Staff.create({
                price: data?.price || 0,
                position: positionInsert,
                departmentId: data.departmentId,
                status: status.ACTIVE,
                descriptionId: descriptionId,
                userId: userId
            });
            return true;
        } else {
            await descriptionService.deleteDescription(descriptionId);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
const updateStaff = async (data) => {
    try {
        let staff = await db.Staff.findOne({
            where: { userId: data.id }
        });
        if (staff) {
            let description = await descriptionService.updateDescription(data, staff.descriptionId);
            if (description) {
                await staff.update({
                    price: data.price,
                    position: data.position,
                    departmentId: data.departmentId,
                });
                return true
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    getAllStaff,
    getStaffbyDepartmentId,
    getStaffById,
    getStaffByRole,
    getStaffByName,
    createStaff,
    updateStaff
}