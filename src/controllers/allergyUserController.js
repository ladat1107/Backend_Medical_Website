import  { createAllergyUser, deleteAllergyUser, getAllAllergyUsers, getAllergyUserByAllergyId, getAllergyUserByUserId, updateAllergyUser } from '../services/allergyUserService';
import { ERROR_SERVER } from '../utils';

export const getAllAllergyUsersController = async (req, res) => {
    try {
        let response = await getAllAllergyUsers();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getAllergyUserByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getAllergyUserByUserId(data.userId);
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

export const getAllergyUserByAllergyIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.allergyId) {
            let response = await getAllergyUserByAllergyId(data.allergyId);
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

export const createAllergyUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.allergyId && data.discoveryDate) {
            let response = await createAllergyUser(data);
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

export const updateAllergyUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.allergyId && data.discoveryDate) {
            let response = await updateAllergyUser(data);
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

export const deleteAllergyUserController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId && data.allergyId) {
            let response = await deleteAllergyUser(data);
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