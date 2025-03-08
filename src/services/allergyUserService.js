import db from "../models/index";
import { ERROR_SERVER } from "../utils";

export const getAllAllergyUsers = async () => {
    try {
        let allergyUsers = await db.AllergyUser.findAll({
            include: [{
                model: db.User,
                as: "allergyUserUserData",
                attributes: ["id", "lastName", "firstName", "email", "phoneNumber", "avatar"],
            }, {
                model: db.Allergy,
                as: "allergyUserAllergyData",
                attributes: ["id", "agent", "diseaseManifestation"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người dùng có dị ứng thành công",
            DT: allergyUsers
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAllergyUserByUserId = async (userId) => {
    try {
        let allergyUser = await db.AllergyUser.findOne({
            where: { userId: userId },
            include: [{
                model: db.Allergy,
                as: "allergyUserAllergyData",
                attributes: ["id", "agent", "diseaseManifestation"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người dùng có dị ứng thành công",
            DT: allergyUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAllergyUserByAllergyId = async (allergyId) => {
    try {
        let allergyUser = await db.AllergyUser.findOne({
            where: { allergyId: allergyId },
            include: [{
                model: db.User,
                as: "allergyUserUserData",
                attributes: ["id", "lastName", "firstName", "email", "phoneNumber", "avatar"],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin người dùng có dị ứng thành công",
            DT: allergyUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createAllergyUser = async (data) => {
    try {
        let allergyUser = await db.AllergyUser.create({
            userId: data.userId,
            allergyId: data.allergyId,
            discoveryDate: data.discoveryDate,
        });
        return {
            EC: 0,
            EM: "Tạo thông tin người dùng có dị ứng thành công",
            DT: allergyUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateAllergyUser = async (data) => {
    try {
        let allergyUser = await db.AllergyUser.update({
            discoveryDate: data.discoveryDate,
        }, {
            where: { userId: data.userId, allergyId: data.allergyId },
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin người dùng có dị ứng thành công",
            DT: allergyUser
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteAllergyUser = async (data) => {
    try {
        await db.AllergyUser.destroy({
            where: { userId: data.userId, allergyId: data.allergyId },
        });
        return {
            EC: 0,
            EM: "Xóa thông tin người dùng có dị ứng thành công",
            DT: "",
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
