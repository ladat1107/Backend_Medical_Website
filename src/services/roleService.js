import db from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";

export const getAllRoles = async () => {
    try {
        let role = await db.Role.findAll({
            where: {
                status: status.ACTIVE,
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin role thành công",
            DT: role
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getRoleById = async (roleId) => {
    try {
        let role = await db.Role.findOne({
            where: {
                id: roleId,
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin role thành công",
            DT: role
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createRole = async (roleData) => {
    try {
        let role = await db.Role.create({
            name: roleData.name,
            status: status.ACTIVE,
        });
        return {
            EC: 0,
            EM: "Tạo role thành công",
            DT: role
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateRole = async (roleData) => {
    try {
        let role = await db.Role.update({
            name: roleData.name,
            status: roleData.status,
        }, {
            where: { id: roleData.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật role thành công",
            DT: role
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
