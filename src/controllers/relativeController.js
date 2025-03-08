import { createRelative, deleteRelative, getAllRelatives, getRelativeById, getRelativesByUserId, updateRelative } from '../services/relativeService';
import { ERROR_SERVER } from '../utils';

export const getAllRelativesController = async (req, res) => {
    try {
        let response = await getAllRelatives();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getRelativesByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getRelativesByUserId(data.userId);
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

export const getRelativeByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getRelativeById(data.id);
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

export const createRelativeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.fullName && data.cid && data.phoneNumber && data.relationship && data.address && data.userId && data.email !== undefined) {
            let response = await createRelative(data);
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

export const updateRelativeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.fullName && data.cid && data.phoneNumber && data.relationship && data.address && data.email !== undefined) {
            let response = await updateRelative(data);
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

export const deleteRelativeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteRelative(data.id);
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
