import patientService from '../services/patientService';

const getAllPatients = async (req, res) => {
    try{
        let response = await patientService.getAllPatients();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getPatientById = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.id) {
            let response = await patientService.getPatientById(data.id);
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

const getPatientByUserId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.userId) {
            let response = await patientService.getPatientByUserId(data.userId);
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

const createPatient = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.dateOfAdmission && data.bedId && data.userId) {
            let response = await patientService.createPatient(data);
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

const updatePatient = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.id && data.dateOfAdmission && data.dateOfDischarge && data.bedId) {
            let response = await patientService.updatePatient(data);
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
    getAllPatients,
    getPatientById,
    getPatientByUserId,
    createPatient,
    updatePatient
}