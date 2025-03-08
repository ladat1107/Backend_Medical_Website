import { createMedicine, deleteMedicine, getAllMedicines, getAllMedicinesForExam, getMedicineById, updateMedicine } from "../services/medicineService";
import { ERROR_SERVER } from "../utils";

export const getAllMedicinesController = async (req, res) => {
    try {
        let response = await getAllMedicines();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const getAllMedicinesForExamController = async (req, res) => {
    try {
        let response = await getAllMedicinesForExam();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const getMedicineByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getMedicineById(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const createMedicineController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.price && data.registrationNumber && data.unit && data.inventory
            && data.exp && data.approvalNumber && data.approvalDate && data.dosageForm && data.manufacturerCountry
            && data.description && data.activeIngredient && data.group && data.concentration
        ) {
            let response = await createMedicine(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const updateMedicineController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.price && data.registrationNumber && data.unit && data.inventory
            && data.exp && data.approvalNumber && data.approvalDate && data.dosageForm && data.manufacturerCountry
            && data.description && data.activeIngredient && data.group && data.concentration
        ) {
            let response = await updateMedicine(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const deleteMedicineController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteMedicine(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}
