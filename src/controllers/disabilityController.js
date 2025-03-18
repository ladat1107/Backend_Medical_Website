import { createDisability, deleteDisability, getAllDisability, getDisabilityById, updateDisability } from '../services/disabilityService';
import { ERROR_SERVER } from '../utils';

export const getAllDisabilitiesController = async (req, res) => {
    try {
        let response = await getAllDisability();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getDisabilityByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getDisabilityById(data.id);
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

export const createDisabilityController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.bodyPart) {
            let response = await createDisability(data);
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

export const updateDisabilityController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.bodyPart) {
            let response = await updateDisability(data);
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

export const deleteDisabilityController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteDisability(data.id);
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
