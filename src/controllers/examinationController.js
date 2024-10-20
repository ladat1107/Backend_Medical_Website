import examinationService from '../services/examinationService';

const getExaminationById = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.id) {
            let response = await examinationService.getExaminationById(data.id);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getExaminationByUserId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.userId) {
            let response = await examinationService.getExaminationByUserId(data.userId);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const createExamination = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.userId && data.staffId && data.symptom && data.diseaseName
            && data.price && data.insuranceCoverage
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
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const updateExamination = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.id && data.symptom && data.diseaseName
            && data.treatmentResult && data.admissionDate && data.dischargeDate && data.reason 
            && data.medicalTreatmentTier && data.paymentDoctorStatus && data.price !== undefined
            && data.special !== undefined && data.insuranceCoverage
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
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const deleteExamination = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.id) {
            let response = await examinationService.deleteExamination(data.id);
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
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getExaminationById,
    getExaminationByUserId,
    createExamination,
    updateExamination,
    deleteExamination
}