import { where } from "sequelize";
import db from "../models/index";
import { status } from "../utils/index";

const getAllRoles = async () => {
    try{
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const getRoleById = async (roleId) => {
    try{
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const createRole = async (roleData) => {
    try{
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateRole = async (roleData) => {
    try{
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
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole
}