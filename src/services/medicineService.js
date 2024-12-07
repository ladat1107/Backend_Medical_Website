import db from "../models/index";
import { status } from "../utils/index";

const insertMedicine = async () => {
    try {

    } catch (error) {
        console.log(error);
        console.log("Lỗi hệ thống");
    }
}

const getAllMedicines = async () => {
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
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const getAllMedicinesForExam = async () => {
    try {
        let medicines = await db.Medicine.findAll({
            where: { status: status.ACTIVE },
            attributes: ['id', 'name', 'price', 'unit'],
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
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const getMedicineById = async (id) => {
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
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const createMedicine = async (data) => {
    try {
        let newMedicine = await db.Medicine.create({
            name: data.name,
            price: data.price,
            registrationNumber: data.registrationNumber,
            unit: data.unit,
            inventory: data.inventory,
            exp: data.exp,
            approvalNumber: data.approvalNumber,
            approvalDate: data.approvalDate,
            dosageForm: data.dosageForm,
            manufacturerCountry: data.manufacturerCountry,
            description: data.description,
            activeIngredient: data.activeIngredient,
            group: data.group,
            concentration: data.concentration,
            status: status.ACTIVE,
        });
        return {
            EC: 0,
            EM: "Tạo mới thuốc thành công",
            DT: newMedicine
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const updateMedicine = async (data) => {
    try {
        let medicine = await db.Medicine.update({
            name: data.name,
            price: data.price,
            registrationNumber: data.registrationNumber,
            unit: data.unit,
            inventory: data.inventory,
            exp: data.exp,
            approvalNumber: data.approvalNumber,
            approvalDate: data.approvalDate,
            dosageForm: data.dosageForm,
            manufacturerCountry: data.manufacturerCountry,
            description: data.description,
            activeIngredient: data.activeIngredient,
            group: data.group,
            concentration: data.concentration,
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

const updateInventory = async (medicineId, quantityChange) => {
    const medicine = await db.Medicine.findByPk(medicineId);

    if (medicine) {
        await medicine.update({
            inventory: medicine.inventory - quantityChange
        });
    } else {
      console.warn(`Medicine with id ${medicineId} not found`);
    }
}

const deleteMedicine = async (id) => {
    try {
        let medicine = await db.Medicine.update({
            status: status.INACTIVE
        }, {
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Xóa thuốc thành công",
            DT: medicine
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        }
    }
}

module.exports = {
    insertMedicine,
    getAllMedicines,
    getAllMedicinesForExam,
    getMedicineById,
    createMedicine,
    updateMedicine,
    updateInventory,
    deleteMedicine
}