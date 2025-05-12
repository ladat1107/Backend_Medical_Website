import db from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";

export const getAllRelatives = async () => {
    try {
        let relative = await db.Relative.findAll({
            where: {
                status: status.ACTIVE,
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getRelativesByUserId = async (userId) => {
    try {
        let relative = await db.Relative.findAll({
            where: {
                userId: userId,
                status: status.ACTIVE,
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getRelativeById = async (id) => {
    try {
        let relative = await db.Relative.findOne({
            where: {
                id: id
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createRelative = async (data) => {
    try {
        let relative = await db.Relative.create({
            fullName: data.fullName,
            cid: data.cid,
            phoneNumber: data.phoneNumber,
            relationship: data.relationship,
            address: data.address,
            email: data.email || "",
            status: status.ACTIVE,
            userId: data.userId,
        });
        return {
            EC: 0,
            EM: "Tạo relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateRelative = async (data) => {
    try {
        let relative = await db.Relative.update({
            fullName: data.fullName,
            cid: data.cid,
            phoneNumber: data.phoneNumber,
            relationship: data.relationship,
            address: data.address,
            email: data.email,
        }, {
            where: {
                id: data.id,
            }
        });
        return {
            EC: 0,
            EM: "Cập nhật relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteRelative = async (id) => {
    try {
        let relative = await db.Relative.destroy({
            where: {
                id: id,
            }
        });
        return {
            EC: 0,
            EM: "Xóa relative thành công",
            DT: relative
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
