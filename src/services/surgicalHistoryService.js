import db from "../models/index";
import { status } from "../utils/index";

const getAllSurgicalHistories = async () => {
    try {
        let surgicalHistory = await db.SurgicalHistory.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin surgicalHistory thành công",
            DT: surgicalHistory
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const getSurgicalHistoryById = async (id) => {
    try {
        let surgicalHistory = await db.SurgicalHistory.findOne({
            where: {
                id: id
            },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin surgicalHistory thành công",
            DT: surgicalHistory
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const createSurgicalHistory = async (data) => {
    try {
        let surgicalHistory = await db.SurgicalHistory.create({
            diseaseName: data.diseaseName,
            bodyPart: data.bodyPart,
            status: status.ACTIVE
        });
        return {
            EC: 0,
            EM: "Tạo thông tin surgicalHistory thành công",
            DT: surgicalHistory
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const updateSurgicalHistory = async (data) => {
    try {
        let surgicalHistory = await db.SurgicalHistory.update({
            diseaseName: data.diseaseName,
            bodyPart: data.bodyPart,
        }, {
            where: {
                id: data.id
            }
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin surgicalHistory thành công",
            DT: surgicalHistory
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const deleteSurgicalHistory = async (id) => {
    try {
        let surgicalHistory = await db.SurgicalHistory.update({
            status: status.INACTIVE,
        }, {
            where: {
                id: id
            }
        });
        return {
            EC: 0,
            EM: "Xóa thông tin surgicalHistory thành công",
            DT: surgicalHistory
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

module.exports = {
    getAllSurgicalHistories,
    getSurgicalHistoryById,
    createSurgicalHistory,
    updateSurgicalHistory,
    deleteSurgicalHistory
}