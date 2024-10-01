import db from "../models/index";
import { status } from "../utils/index";

const getAllDisability = async () => {
    try {
        let disbility = await db.Disability.findAll({
            where: {status: status.ACTIVE},
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin khuyết tật thành công",
            DT: disbility
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

const getDisabilityById = async (disbilityId) => {
    try {
        let disbility = await db.Disability.findOne({
            where: {id: disbilityId},
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin khuyết tật thành công",
            DT: disbility
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

const createDisability = async (data) => {
    try {
        let newDisbility = await db.Disability.create({
            bodyPart: data.bodyPart,
            status: status.ACTIVE
        });
        return {
            EC: 0,
            EM: "Tạo khuyết tật thành công",
            DT: newDisbility
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

const updateDisability = async (data) => {
    try{
        let updateDisbility = await db.Disability.update({
            bodyPart: data.bodyPart,
        }, {
            where: {id: data.id}
        });
        return {
            EC: 0,
            EM: "Cập nhật khuyết tật thành công",
            DT: updateDisbility
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

const deleteDisability = async (disbilityId) => {
    try {
        let deleteDisbility = await db.Disability.update({
            status: status.INACTIVE
        }, {
            where: {id: disbilityId}
        });
        return {
            EC: 0,
            EM: "Xóa khuyết tật thành công",
            DT: deleteDisbility
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
    getAllDisability,
    getDisabilityById,
    createDisability,
    updateDisability,
    deleteDisability
}