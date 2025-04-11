import { createExamination, deleteExamination, getExaminationById, getExaminationByUserId, getExaminations, getListToPay, getPatienSteps, getScheduleApoinment, updateExamination, updateOldParaclinical } from '../services/examinationService';
import { ERROR_SERVER } from '../utils';

export const getExaminationByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getExaminationById(data.id);
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

export const getExaminationByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        let userId = req.user.id;
        let response = await getExaminationByUserId(userId, data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createExaminationController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.staffId && data.symptom
        ) {
            let response = await createExamination(data);
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

export const updateExaminationController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id
            // && data.symptom && data.diseaseName
            // && data.treatmentResult && data.admissionDate && data.dischargeDate && data.reason
            // && data.medicalTreatmentTier && data.paymentDoctorStatus && data.price !== undefined
            // && data.special !== undefined && data.insuranceCoverage
        ) {
            let response = await updateExamination(data, req.user.id);
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

export const updateOldParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        let response = await updateOldParaclinical(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteExaminationController = async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            let response = await deleteExamination(id);
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

export const getExaminationsController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let toDate = req.query.toDate || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        let time = req.query.time || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getExaminations(date, toDate, status, staffId, +page, +limit, search, time);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getListToPayController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let statusPay = req.query.statusPay || null;
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getListToPay(date, statusPay, +page, +limit, search);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getScheduleApoinmentController = async (req, res) => {
    try {
        let data = req.query;
        let response = await getScheduleApoinment(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getPatienStepsController = async (req, res) => {
    try {
        let data = req.query.examId;
        let response = await getPatienSteps(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}