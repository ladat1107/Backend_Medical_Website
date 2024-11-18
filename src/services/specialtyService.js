import { Op } from "sequelize";
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
let getAllSpecialtyAdmin = async (page, limit, search) => {
    try {
        let specialtyData = await db.Specialty.findAndCountAll({
            where: {
                [Op.or]: [{ name: { [Op.like]: `%${search}%` } },]
            },
            order: [
                ["status", "DESC"],
                ['id']], // Sắp xếp theo ngày tạo mới nhất

            // Phân trang
            offset: (+page - 1) * +limit,
            limit: +limit,
            raw: false,
            nest: true,
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
            where: { status: status.ACTIVE },
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
            name: data?.name,
            image: data?.image,
            shortDescription: data?.shortDescription,
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
            shortDescription: data?.shortDescription || null,
            status: data?.status,
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
        let specialty = await db.Specialty.destroy({
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
let getSpecialtyById = async (id) => {
    try {
        let specialtyData = await db.Specialty.findOne({
            where: { id: id, status: status.ACTIVE },
            include: [
                {
                    model: db.Staff,
                    as: "staffSpecialtyData",
                    attributes: ["id", "price", "position"],
                    include: [
                        {
                            model: db.User,
                            as: "staffUserData",
                            attributes: ["id", "lastName", "firstName", "avatar"],
                        },
                        {
                            model: db.Department,
                            as: "staffDepartmentData",
                            attributes: ["id", "name"],
                        }
                    ]
                }
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
module.exports = {
    getSpecialtySelect,
    getSpcialtyHome,
    createSpecialty,
    updateSpecialty,
    blockSpecialty,
    deleteSpecialty,
    getAllSpecialtyAdmin,
    getSpecialtyById,
}