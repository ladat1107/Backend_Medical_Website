import { createOrUpdateVitalSign, createVitalSign, deleteVitalSign, getVitalSignByExamId, updateVitalSign } from '../services/vitalSignService';
import { ERROR_SERVER } from '../utils';

export const getVitalSignByExamIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await getVitalSignByExamId(data.examinationId);
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

export const createVitalSignController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.height && data.weight
            && data.pulse && data.temperature && data.hightBloodPressure && data.lowBloodPressure
            && data.breathingRate) {
            let response = await createVitalSign(data);
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

export const updateVitalSignController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await updateVitalSign(data);
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

export const deleteVitalSignController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await deleteVitalSign(data.id);
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

export const createOrUpdateVitalSignController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.height && data.weight
            && data.pulse && data.temperature && data.hightBloodPressure && data.lowBloodPressure
            && data.breathingRate) {
            let response = await createOrUpdateVitalSign(data);
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
