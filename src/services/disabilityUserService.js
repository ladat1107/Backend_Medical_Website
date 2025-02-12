import db from "../models/index";

const getAllDisabilityUser = async () => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getDisabilityUserByUserId = async (userId) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getDisabilityUserByDisabilityId = async (disabilityId) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const createDisabilityUser = async (data) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const updateDisabilityUser = async (data) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const deleteDisabilityUser = async (data) => {
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
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

module.exports = {
    getAllDisabilityUser,
    getDisabilityUserByUserId,
    getDisabilityUserByDisabilityId,
    createDisabilityUser,
    updateDisabilityUser,
    deleteDisabilityUser
}