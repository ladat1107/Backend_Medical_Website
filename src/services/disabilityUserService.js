import db from "../models/index";
import { ERROR_SERVER } from "../utils";

export const getAllDisabilityUser = async () => {
    try {
        let disabilityUser = await db.DisabilityUser.findAll({
            include: [{
                model: db.User,
                as: "disablityUserUserData",
                attributes: ["id", "lastName", "firstName", "email", "phoneNumber", "avatar"],
            }, {
                model: db.Disability,
                as: "disablityUserDisabilityData",
                attributes: ["id", "bodyPart"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người khuyết tật thành công",
            DT: disabilityUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getDisabilityUserByUserId = async (userId) => {
    try {
        let disabilityUser = await db.DisabilityUser.findOne({
            where: { userId: userId },
            include: [{
                model: db.Disability,
                as: "disablityUserDisabilityData",
                attributes: ["id", "bodyPart"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người khuyết tật thành công",
            DT: disabilityUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getDisabilityUserByDisabilityId = async (disabilityId) => {
    try {
        let disabilityUser = await db.DisabilityUser.findOne({
            where: { disabilityId: disabilityId },
            include: [{
                model: db.User,
                as: "disablityUserUserData",
                attributes: ["id", "lastName", "firstName", "email", "phoneNumber", "avatar"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người khuyết tật thành công",
            DT: disabilityUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createDisabilityUser = async (data) => {
    try {
        await db.DisabilityUser.create({
            userId: data.userId,
            disabilityId: data.disabilityId,
            description: data.description,
            medicalFacilityRecords: data.medicalFacilityRecords
        });
        return {
            EC: 0,
            EM: "Tạo thông tin người khuyết tật thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateDisabilityUser = async (data) => {
    try {
        await db.DisabilityUser.update({
            description: data.description,
            medicalFacilityRecords: data.medicalFacilityRecords
        }, {
            where: { userId: data.userId, disabilityId: data.disabilityId }
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin người khuyết tật thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteDisabilityUser = async (data) => {
    try {
        await db.DisabilityUser.destroy({
            where: { userId: data.userId, disabilityId: data.disabilityId }
        });
        return {
            EC: 0,
            EM: "Xóa thông tin người khuyết tật thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
