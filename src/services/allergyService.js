import db from "../models/index";
import { status } from "../utils/index";

const getAllAllergies = async () => {
    try {
        let allergies = await db.Allergy.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin dị ứng thành công",
            DT: allergies
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getAllergyById = async (id) => {
    try {
        let allergy = await db.Allergy.findOne({
            where: { id: id },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin dị ứng thành công",
            DT: allergy
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createAllergy = async (data) => {
    try {
        let allergy = await db.Allergy.create({
            agent: data.agent,
            diseaseManifestation: data.diseaseManifestation,
            status: status.ACTIVE
        });
        return {
            EC: 0,
            EM: "Tạo dị ứng thành công",
            DT: allergy
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const updateAllergy = async (data) => {
    try {
        let allergy = await db.Allergy.update({
            agent: data.agent,
            diseaseManifestation: data.diseaseManifestation,
        }, {
            where: { id: data.id },
        });
        return {
            EC: 0,
            EM: "Cập nhật dị ứng thành công",
            DT: allergy
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const deleteAllergy = async (id) => {
    try {
        let allergy = await db.Allergy.update({
            status: status.INACTIVE,
        }, {
            where: { id: id },
        });
        return {
            EC: 0,
            EM: "Xóa dị ứng thành công",
            DT: allergy
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

module.exports = {
    getAllAllergies,
    getAllergyById,
    createAllergy,
    updateAllergy,
    deleteAllergy
}