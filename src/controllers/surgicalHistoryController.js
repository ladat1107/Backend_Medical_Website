import { createSurgicalHistory, deleteSurgicalHistory, getAllSurgicalHistories, getSurgicalHistoryById, updateSurgicalHistory } from '../services/surgicalHistoryService';
import { ERROR_SERVER } from '../utils';

export const getAllSurgicalHistoriesController = async (req, res) => {
    try {
        let response = await getAllSurgicalHistories();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getSurgicalHistoryByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getSurgicalHistoryById(data.id);
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

export const createSurgicalHistoryController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.diseaseName && data.bodyPart) {
            let response = await createSurgicalHistory(data);
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

export const updateSurgicalHistoryController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.diseaseName && data.bodyPart) {
            let response = await updateSurgicalHistory(data);
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

export const deleteSurgicalHistoryController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteSurgicalHistory(data.id);
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

