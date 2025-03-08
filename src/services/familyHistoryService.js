import db from "../models/index";
import { ERROR_SERVER } from "../utils";

export const getAllFamilyHistories = async () => {
    try {
        let familyHistory = await db.FamilyHistory.findAll({
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin familyHistory thành công",
            DT: familyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getFamilyHistoryById = async (id) => {
    try {
        let familyHistory = await db.FamilyHistory.findOne({
            where: {
                id: id
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin familyHistory thành công",
            DT: familyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getFamilyHistoriesByUserId = async (userId) => {
    try {
        let familyHistory = await db.FamilyHistory.findAll({
            where: {
                userId: userId
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin familyHistory thành công",
            DT: familyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createFamilyHistory = async (data) => {
    try {
        let newFamilyHistory = await db.FamilyHistory.create({
            relationship: data.relationship,
            diseaseGroup: data.diseaseGroup,
            diseaseName: data.diseaseName,
            description: data.description,
            discoveryDate: data.discoveryDate,
            illnessDuration: data.illnessDuration,
            medicalFacilityRecords: data.medicalFacilityRecords,
            userId: data.userId,
        });
        return {
            EC: 0,
            EM: "Tạo lịch sử gia đình thành công",
            DT: newFamilyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateFamilyHistory = async (data) => {
    try {
        let familyHistory = await db.FamilyHistory.update({
            relationship: data.relationship,
            diseaseGroup: data.diseaseGroup,
            diseaseName: data.diseaseName,
            description: data.description,
            discoveryDate: data.discoveryDate,
            illnessDuration: data.illnessDuration,
            medicalFacilityRecords: data.medicalFacilityRecords,
        }, {
            where: {
                id: data.id,
            }
        });
        return {
            EC: 0,
            EM: "Cập nhật lịch sử gia đình thành công",
            DT: familyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const deleteFamilyHistory = async (id) => {
    try {
        let familyHistory = await db.FamilyHistory.destroy({
            where: {
                id: id
            }
        });
        return {
            EC: 0,
            EM: "Xóa lịch sử gia đình thành công",
            DT: familyHistory
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
