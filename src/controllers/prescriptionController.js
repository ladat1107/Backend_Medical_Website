import prescriptionService from '../services/prescriptionService';

const getPrescriptionByExaminationId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await prescriptionService.getPrescriptionByExaminationId(data.examinationId);
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

const upsertPrescription = async (req, res) => {
    try {
        let data = req.body;
        let response = await prescriptionService.upsertPrescription(data);
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

const getPrescriptions = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await prescriptionService.getPrescriptions(date, status, staffId, +page, +limit, search);
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

const updatePrescription = async (req, res) => {
    try {
        let data = req.body;
        let response = await prescriptionService.updatePrescription(data);
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
    getPrescriptionByExaminationId,
    upsertPrescription,
    getPrescriptions,
    updatePrescription
}