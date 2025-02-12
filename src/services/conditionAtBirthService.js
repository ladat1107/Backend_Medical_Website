import db from '../models/index';

const getConditionAtBirthById = async (id) => {
    try {
        let getConditionAtBirth = await db.ConditionAtBirth.findOne({
            where: { id: id },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin điều kiện sinh thành công",
            DT: getConditionAtBirth
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

const getConditionAtBirthByUserId = async (userId) => {
    try {
        let getConditionAtBirth = await db.ConditionAtBirth.findOne({
            where: { userId: userId },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin điều kiện sinh thành công",
            DT: getConditionAtBirth
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

const createConditionAtBirth = async (data) => {
    try {
        let createConditionAtBirth = await db.ConditionAtBirth.create({
            userId: data.userId,
            typeOfBirth: data.typeOfBirth,
            weight: data.weight,
            height: data.height,
            detail: data.detail
        });
        return {
            EC: 0,
            EM: "Tạo điều kiện sinh thành công",
            DT: createConditionAtBirth
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

const updateConditionAtBirth = async (data) => {
    try {
        let updateConditionAtBirth = await db.ConditionAtBirth.update({
            typeOfBirth: data.typeOfBirth,
            weight: data.weight,
            height: data.height,
            detail: data.detail
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật điều kiện sinh thành công",
            DT: updateConditionAtBirth
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

const deleteConditionAtBirth = async (id) => {
    try {
        let deleteConditionAtBirth = await db.ConditionAtBirth.destroy({
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Xóa điều kiện sinh thành công",
            DT: deleteConditionAtBirth
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
    getConditionAtBirthById,
    getConditionAtBirthByUserId,
    createConditionAtBirth,
    updateConditionAtBirth,
    deleteConditionAtBirth
}