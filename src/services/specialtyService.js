import db from "../models";
import { status } from "../utils";

let getSpecialtySelect = async () => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: { status: 1 },
            attributes: [
                ['id', 'value'],
                ['name', 'label']
            ]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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
let getSpcialtyHome = async () => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: { status: 1 },
            attributes: ["id", "name", "image"]
        });
        return {
            EC: 0,
            EM: "Lấy thông tin chuyên khoa thành công",
            DT: specialtyData
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
let createSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.create({
            name: data.name,
            image: data.image,
            status: status.ACTIVE,
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Tạo chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Tạo chuyên khoa thành công",
            DT: specialty
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
let updateSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.update({
            name: data?.name || null,
            image: data?.image || null,
            status: data?.status || null
        }, {
            where: { id: data.id }
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Cập nhật chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật chuyên khoa thành công",
            DT: specialty
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
let blockSpecialty = async (data) => {
    try {
        let specialty = await db.Specialty.update({
            status: status.INACTIVE
        }, {
            where: { id: data.id }
        });
        if (!specialty) {
            return {
                EC: 400,
                EM: "Khóa chuyên khoa thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Khóa chuyên khoa thành công",
            DT: specialty
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
let deleteSpecialty = async (data) => {
    let transaction = await db.sequelize.transaction();
    try {
        await db.Staff.update({ specialtyId: null },// Giá trị cần cập nhật
            {
                where: {
                    specialtyId: data.id
                }
            }, { transaction });
        await db.Room.update(
            { medicalExamination: null }, // Giá trị cần cập nhật
            {
                where: {
                    medicalExamination: data.id
                }
            }
            , { transaction });
        let specialty = await db.Specialty.update({
            status: status.INACTIVE
        }, {
            where: { id: data.id }
        }, { transaction });
        if (specialty) {
            await transaction.commit();
            return {
                EC: 0,
                EM: "Xóa chuyên khoa thành công",
                DT: specialty
            }
        } else {
            return {
                EC: 400,
                EM: "Xóa chuyên khoa thất bại",
                DT: ""
            }
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
module.exports = {
    getSpecialtySelect,
    getSpcialtyHome,
    createSpecialty,
    updateSpecialty,
    blockSpecialty,
    deleteSpecialty,
}