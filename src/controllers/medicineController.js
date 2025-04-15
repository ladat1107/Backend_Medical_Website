import { blockMedicine, createMedicine, deleteMedicine, getAllMedicines, getAllMedicinesAdmin, getAllMedicinesForExam, getMedicineById, updateMedicine } from "../services/medicineService";
import { ERROR_SERVER } from "../utils";

export const getAllMedicinesController = async (req, res) => {
    try {
        let response = await getAllMedicines();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const getAllMedicinesForExamController = async (req, res) => {
    try {
        let response = await getAllMedicinesForExam();
        return res.status(200).json(response)
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

export const getAllMedicinesAdminController = async (req, res) => {
    try {
        let response = await getAllMedicinesAdmin();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const createMedicineController = async (req, res) => {
    try {
        let data = req.body;
        let response = await createMedicine(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const updateMedicineController = async (req, res) => {
    try {
        let data = req.body;
        let response = await updateMedicine(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}

export const blockMedicineController = async (req, res) => {
    try {
        let data = req.body;
        let response = await blockMedicine(data.id);
        return res.status(200).json(response)
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
