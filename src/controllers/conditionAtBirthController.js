import conditionAtBirthService, { createConditionAtBirth, deleteConditionAtBirth, getConditionAtBirthById, getConditionAtBirthByUserId, updateConditionAtBirth } from '../services/conditionAtBirthService';
import { ERROR_SERVER } from '../utils';

export const getConditionAtBirthByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getConditionAtBirthById(data.id);
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

export const getConditionAtBirthByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getConditionAtBirthByUserId(data.userId);
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

export const createConditionAtBirthController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.typeOfBirth && data.weight && data.height && data.detail) {
            let response = await createConditionAtBirth(data);
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

export const updateConditionAtBirthController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.typeOfBirth && data.weight && data.height && data.detail) {
            let response = await updateConditionAtBirth(data);
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

export const deleteConditionAtBirthController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await deleteConditionAtBirth(data.id);
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
