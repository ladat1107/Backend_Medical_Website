import prescriptionService from '../services/prescriptionService';

const getPrescriptionByExaminationId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.examinationId) {
            let response = await prescriptionService.getPrescriptionByExaminationId(data.examinationId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const upsertPrescription = async (req, res) => {
    try{
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
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getPrescriptionByExaminationId,
    upsertPrescription
}