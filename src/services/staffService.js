import db, { sequelize } from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";
import descriptionService from "./descriptionService";
export const { Op } = require('sequelize');

export const getAllStaff = async () => {
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
            },{
                model: db.Department,
                as: 'staffDepartmentData',
                attributes: ['name']
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
        return ERROR_SERVER
    }
}

export const getStaffbyDepartmentId = async (departmentId) => {
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
                model: db.Handbook,
                as: 'staffHandbookData',
                attributes: ['id', 'title', 'image', 'createdAt', "shortDescription"],
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
        return ERROR_SERVER
    }
}

export const getStaffById = async (staffId) => {
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
        return ERROR_SERVER
    }
}

export const getStaffNameById = async (staffId) => {
    try {
        let staff = await db.Staff.findOne({
            where: { id: +staffId },
            include: [{
                model: db.User,
                as: 'staffUserData',
                attributes: ['id', 'lastName', 'firstName'],
            }],
            attributes: ['id'],
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
        return ERROR_SERVER
    }
}

export const getStaffByRole = async (roleId) => {
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
            }]
        });

        return {
            EC: 0,
            EM: "Lấy thông tin nhân viên thành công",
            DT: staff
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getStaffByName = async (name) => {
    try {
        if (!name) name = ""
        let staff = await db.Staff.findAll({
            where: {
                status: status.ACTIVE
            },
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
        return ERROR_SERVER
    }
}

export const createStaff = async (data, userId) => {
    try {
        await db.Staff.create({
            price: data?.price || 0,
            position: data?.position ? data.position.toString() : "",
            departmentId: data.departmentId,
            shortDescription: data?.shortDescription || null,
            specialtyId: data?.specialtyId || null,
            status: status.ACTIVE,
            htmlDescription: data?.htmlDescription || null,
            userId: userId
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const updateStaff = async (data) => {
    try {
        let staff = await db.Staff.findOne({
            where: { userId: data.id }
        });
        if (staff) {
            await staff.update({
                price: data.price,
                position: data.position,
                shortDescription: data?.shortDescription || null,
                specialtyId: data?.specialtyId,
                htmlDescription: data?.htmlDescription || null,
            });
            return true
        }
        else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const profileStaff = async (data) => {
    try {
        await db.Staff.update({
            shortDescription: data?.shortDescription || null,
            htmlDescription: data?.htmlDescription || null,
            specialtyId: data?.specialtyId || null,
            position: data?.position?.toString() || null,
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật hồ sơ thành công",
            DT: ""
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}