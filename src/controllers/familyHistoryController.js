import  { createFamilyHistory, deleteFamilyHistory, getAllFamilyHistories, getFamilyHistoriesByUserId, getFamilyHistoryById, updateFamilyHistory } from '../services/familyHistoryService';
import { ERROR_SERVER } from '../utils';

export const getAllFamilyHistoriesController = async (req, res) => {
    try {
        let response = await getAllFamilyHistories();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getFamilyHistoryByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getFamilyHistoryById(data.id);
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
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getFamilyHistoriesByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getFamilyHistoriesByUserId(data.userId);
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
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createFamilyHistoryController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.relationship && data.diseaseGroup && data.diseaseName && data.medicalFacilityRecords
            && data.description && data.discoveryDate && data.illnessDuration && data.userId) {
            let response = await createFamilyHistory(data);
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
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updateFamilyHistoryController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.relationship && data.diseaseGroup && data.diseaseName && data.medicalFacilityRecords
            && data.description && data.discoveryDate && data.illnessDuration) {
            let response = await updateFamilyHistory(data);
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
        return res.status(500).json(ERROR_SERVER)
    }
}

export const deleteFamilyHistoryController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await deleteFamilyHistory(data.id);
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
        return res.status(500).json(ERROR_SERVER)
    }
}
