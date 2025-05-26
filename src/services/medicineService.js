import { Op } from "sequelize";
import db from "../models/index";
import { ERROR_SERVER, status } from "../utils/index";
import dayjs from "dayjs";
export const getAllMedicines = async () => {
    try {
        let medicines = await db.Medicine.findAll({
            where: { status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        if (!medicines) {
            return {
                EC: 404,
                EM: "Không tìm thấy thuốc",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin thuốc thành công",
            DT: medicines
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAllMedicinesForExam = async () => {
    try {
        let medicines = await db.Medicine.findAll({
            where: { status: status.ACTIVE },
            attributes: ['id', 'name', 'price', 'unit', 'batchNumber', 'inventory', 'exp'],
            raw: true,
            nest: true,
        });
        if (!medicines) {
            return {
                EC: 404,
                EM: "Không tìm thấy thuốc",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin thuốc thành công",
            DT: medicines
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getMedicineById = async (id) => {
    try {
        let medicine = await db.Medicine.findOne({
            where: { id: id },
            raw: true,
            nest: true,
        });
        if (!medicine) {
            return {
                EC: 404,
                EM: "Không tìm thấy thuốc",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const getAllMedicinesAdmin = async () => {
    try {
        let medicines = await db.Medicine.findAll({
            order: [['updatedAt', 'DESC']],
            raw: true,
        });
        medicines = medicines.map(medicine => ({
            ...medicine,
            status: medicine.status === status.INACTIVE ? status.INACTIVE : dayjs(medicine.exp).isBefore(dayjs()) ? status.INACTIVE : status.ACTIVE
        }));
        return {
            EC: 0,
            EM: "Lấy thông tin thuốc thành công",
            DT: medicines
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const createMedicine = async (medicines) => {
    try {
        if (!medicines.length) return { EC: 400, EM: "Không có dữ liệu để tạo thuốc", DT: "" };
        const keyPairs = medicines.map(m => ({
            registrationNumber: m.registrationNumber,
            batchNumber: m.batchNumber
        }));

        // Truy vấn 1 lần duy nhất để kiểm tra xem có trùng không
        const existing = await db.Medicine.findAll({
            where: {
                [Op.or]: keyPairs
            },
            attributes: ['registrationNumber', 'batchNumber', 'name']
        });

        // 2. Nếu có bất kỳ bản ghi nào trùng thì không insert
        if (existing.length > 0) {
            let error = "";
            existing.forEach(e => {
                error += `Lô thuốc ${e.batchNumber} của ${e.name} đã tồn tại\n`;
            });
            return {
                EC: 1,
                EM: 'Đã có bản ghi trùng trong cơ sở dữ liệu',
                DT: error
            };
        }

        // 3. Nếu không có trùng thì insert toàn bộ (1 lần)
        await db.Medicine.bulkCreate(medicines, { validate: true });
        return {
            EC: 0,
            EM: "Tạo mới thuốc thành công",
            DT: ""
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateMedicine = async (data) => {
    try {
        // tìm thuốc có trùng 2 trường registrationNumber và batchNumber đó mà không phải id của data.id
        let existing = await db.Medicine.findAll({
            where: {
                registrationNumber: data.registrationNumber,
                batchNumber: data.batchNumber,
                id: { [Op.ne]: data.id }
            }
        })
        if (existing.length > 0) {
            return {
                EC: 400,
                EM: "Số lô thuốc và số đăng ký đã tồn tại. Vui lòng kiểm tra lại",
                DT: ""
            }
        }
        let medicine = await db.Medicine.update({ ...data, isCovered: data?.insuranceCovered ? 1 : 0 }, {
            where: { id: data.id }
        });
        if (!medicine) {
            return {
                EC: 400,
                EM: "Cập nhật thông tin thuốc thất bại",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật thông tin thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const updateInventory = async (medicineId, quantityChange) => {
    const medicine = await db.Medicine.findByPk(medicineId);

    if (medicine) {
        await medicine.update({
            inventory: medicine.inventory - quantityChange
        });
    } else {
        console.warn(`Medicine with id ${medicineId} not found`);
    }
}
export const blockMedicine = async (id) => {
    try {
        let medicine = await db.Medicine.update({
            status: status.INACTIVE
        }, {
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Khóa thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const deleteMedicine = async (id) => {
    try {
        let medicine = await db.Medicine.destroy({
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Xóa thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
