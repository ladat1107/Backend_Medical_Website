import { createPatient, getAllPatients, getPatientById, getPatientByUserId, updatePatient } from '../services/patientService';
import { ERROR_SERVER } from '../utils';

export const getAllPatientsController = async (req, res) => {
    try {
        let response = await getAllPatients();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getPatientByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getPatientById(data.id);
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

export const getPatientByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getPatientByUserId(data.userId);
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

export const createPatientController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.dateOfAdmission && data.bedId && data.userId) {
            let response = await createPatient(data);
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

export const updatePatientController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.dateOfAdmission && data.dateOfDischarge && data.bedId) {
            let response = await updatePatient(data);
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
