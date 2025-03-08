import  { createDisabilityUser, deleteDisabilityUser, getAllDisabilityUser, getDisabilityUserByDisabilityId, getDisabilityUserByUserId, updateDisabilityUser } from '../services/disabilityUserService';
import { ERROR_SERVER } from '../utils';

export const getAllDisabilityUsersController = async (req, res) => {
    try {
        let response = await getAllDisabilityUser();
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

export const getDisabilityUserByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getDisabilityUserByUserId(data.userId);
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

export const getDisabilityUserByDisabilityIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.disabilityId) {
            let response = await getDisabilityUserByDisabilityId(data.disabilityId);
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

export const createDisabilityUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.disabilityId && data.description && data.medicalFacilityRecords) {
            let response = await createDisabilityUser(data);
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

export const updateDisabilityUserController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.disabilityId && data.description && data.medicalFacilityRecords) {
            let response = await updateDisabilityUser(data);
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

export const deleteDisabilityUserController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId && data.disabilityId) {
            let response = await deleteDisabilityUser(data);
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
