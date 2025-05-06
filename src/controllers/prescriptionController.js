import { createPrescription, getPrescriptionByExaminationId, getPrescriptions, updatePrescription, upsertPrescription } from '../services/prescriptionService';
import { ERROR_SERVER } from '../utils';

export const getPrescriptionByExaminationIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await getPrescriptionByExaminationId(data.examinationId);
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

export const upsertPrescriptionController = async (req, res) => {
    try {
        let data = req.body;
        let response = await upsertPrescription(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getPrescriptionsController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getPrescriptions(date, status, staffId, +page, +limit, search);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updatePrescriptionController = async (req, res) => {
    try {
        let data = req.body;
        let response = await updatePrescription(data, null, req.user.id);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createPrescriptionController = async (req, res) => {
    try {
        let data = req.body;
        let response = await createPrescription(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

