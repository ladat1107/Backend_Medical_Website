import { createSurgicalHistoryUser, deleteSurgicalHistoryUser, getAllSurgicalHistoryUser, getSurgicalHistoryUserBySurgicalHistoryId, getSurgicalHistoryUserByUserId, updateSurgicalHistoryUser } from '../services/surgicalHistoryUserService';
import { ERROR_SERVER } from '../utils';

export const getAllSurgicalHistoryUserController = async (req, res) => {
    try {
        let response = await getAllSurgicalHistoryUser();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getSurgicalHistoryUserByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getSurgicalHistoryUserByUserId(data.userId);
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

export const getSurgicalHistoryUserBySurgicalHistoryIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.surgicalhistoryId) {
            let response = await getSurgicalHistoryUserBySurgicalHistoryId(data.surgicalhistoryId);
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

export const createSurgicalHistoryUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.surgicalhistoryId && data.description && data.implementationDate && data.medicalFacilityRecords) {
            let response = await createSurgicalHistoryUser(data);
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

export const updateSurgicalHistoryUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.surgicalhistoryId && data.description && data.implementationDate && data.medicalFacilityRecords) {
            let response = await updateSurgicalHistoryUser(data);
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

export const deleteSurgicalHistoryUserController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId && data.surgicalhistoryId) {
            let response = await deleteSurgicalHistoryUser(data.userId, data.surgicalhistoryId);
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

