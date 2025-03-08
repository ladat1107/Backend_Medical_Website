import { createAllergy, deleteAllergy, getAllAllergies, getAllergyById, updateAllergy } from '../services/allergyService';

export const getAllAllergiesController = async (req, res) => {
    try {
        let response = await getAllAllergies();
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

export const getAllergyByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getAllergyById(data.id);
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
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

export const createAllergyController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.agent && data.diseaseManifestation) {
            let response = await createAllergy(data);
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
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

export const updateAllergyController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.agent && data.diseaseManifestation) {
            let response = await updateAllergy(data);
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
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

export const deleteAllergyController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteAllergy(data.id);
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
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

