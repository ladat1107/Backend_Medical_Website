import examinationService from '../services/examinationService';

const getExaminationById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await examinationService.getExaminationById(data.id);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getExaminationByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await examinationService.getExaminationByUserId(data.userId);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createExamination = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.staffId && data.symptom
        ) {
            let response = await examinationService.createExamination(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const updateExamination = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id
            // && data.symptom && data.diseaseName
            // && data.treatmentResult && data.admissionDate && data.dischargeDate && data.reason
            // && data.medicalTreatmentTier && data.paymentDoctorStatus && data.price !== undefined
            // && data.special !== undefined && data.insuranceCoverage
        ) {
            let response = await examinationService.updateExamination(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const deleteExamination = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await examinationService.deleteExamination(data.id);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getExaminations = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        let time = req.query.time || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await examinationService.getExaminations(date, status, staffId, +page, +limit, search, time);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getListToPay = async (req, res) => {
    try {
        let date = req.query.date || null;
        let statusPay = req.query.statusPay || null;
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await examinationService.getListToPay(date, statusPay, +page, +limit, search);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getScheduleApoinment = async (req, res) => {
    try {
        let data = req.query;
        let response = await examinationService.getScheduleApoinment(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
module.exports = {
    getExaminationById,
    getExaminationByUserId,
    createExamination,
    updateExamination,
    deleteExamination,
    getExaminations,
    getListToPay
    getScheduleApoinment,
}