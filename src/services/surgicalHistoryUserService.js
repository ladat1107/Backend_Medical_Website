import db from "../models/index";
import { status } from "../utils/index";

const getAllSurgicalHistoryUser = async () => {
    try {
        let surgicalHistoryUser = await db.SurgicalhistoryUser.findAll({
            include: [{
                model: db.User,
                as: 'surgicalhistoryUserUserData',
                attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            },{
                model: db.SurgicalHistory,
                as: 'surgicalhistoryUserData',
                attributes: ['id', 'diseaseName', 'bodyPart'],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch sử phẫu thuật thành công",
            DT: surgicalHistoryUser
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

const getSurgicalHistoryUserByUserId = async (userId) => {
    try {
        let surgicalHistoryUser = await db.SurgicalhistoryUser.findAll({
            where: { userId: userId},
            include: [{
                model: db.SurgicalHistory,
                as: 'surgicalhistoryUserData',
                attributes: ['id', 'diseaseName', 'bodyPart'],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch sử phẫu thuật thành công",
            DT: surgicalHistoryUser
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

const getSurgicalHistoryUserBySurgicalHistoryId = async (surgicalHistoryId) => {
    try {
        let surgicalHistoryUser = await db.SurgicalhistoryUser.findAll({
            where: { surgicalhistoryId: surgicalHistoryId},
            include: [{
                model: db.User,
                as: 'surgicalhistoryUserUserData',
                attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch sử phẫu thuật thành công",
            DT: surgicalHistoryUser
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

const createSurgicalHistoryUser = async (data) => {
    try {
        await db.SurgicalhistoryUser.create({
            userId: data.userId,
            surgicalhistoryId: data.surgicalhistoryId,
            description: data.description,
            implementationDate: data.implementationDate,
            medicalFacilityRecords: data.medicalFacilityRecords,
        });
        return {
            EC: 0,
            EM: "Tạo thông tin lịch sử phẫu thuật thành công",
            DT: ""
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

const updateSurgicalHistoryUser = async (data) => {
    try {
        await db.SurgicalhistoryUser.update({
            description: data.description,
            implementationDate: data.implementationDate,
            medicalFacilityRecords: data.medicalFacilityRecords,
        }, {
            where: { userId: data.userId, surgicalhistoryId: data.surgicalhistoryId }
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin lịch sử phẫu thuật thành công",
            DT: ""
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

const deleteSurgicalHistoryUser = async (userId, surgicalhistoryId) => {
    try {
        await db.SurgicalhistoryUser.destroy({
            where: { userId: userId, surgicalhistoryId: surgicalhistoryId }
        });
        return {
            EC: 0,
            EM: "Xóa thông tin lịch sử phẫu thuật thành công",
            DT: ""
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
    getAllSurgicalHistoryUser,
    getSurgicalHistoryUserByUserId,
    getSurgicalHistoryUserBySurgicalHistoryId,
    createSurgicalHistoryUser,
    updateSurgicalHistoryUser,
    deleteSurgicalHistoryUser
}