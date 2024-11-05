import medicineService from "../services/medicineService";

const getAllMedicines = async (req, res) => {
    try {
        let response = await medicineService.getAllMedicines();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

const getAllMedicinesForExam = async (req, res) => {
    try {
        let response = await medicineService.getAllMedicinesForExam();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

const getMedicineById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await medicineService.getMedicineById(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

const createMedicine = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.price && data.registrationNumber && data.unit && data.inventory
            && data.exp && data.approvalNumber && data.approvalDate && data.dosageForm && data.manufacturerCountry
            && data.description && data.activeIngredient && data.group && data.concentration
        ) {
            let response = await medicineService.createMedicine(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

const updateMedicine = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.price && data.registrationNumber && data.unit && data.inventory
            && data.exp && data.approvalNumber && data.approvalDate && data.dosageForm && data.manufacturerCountry
            && data.description && data.activeIngredient && data.group && data.concentration
        ) {
            let response = await medicineService.updateMedicine(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

const deleteMedicine = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await medicineService.deleteMedicine(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: "",
        });
    }
}

module.exports = {
    getAllMedicines,
    getAllMedicinesForExam,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
}