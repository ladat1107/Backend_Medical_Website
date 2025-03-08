import { createBed, deleteBed, getAllBeds, getBedById, getBedByRoom, getBedEmpty, updateBed } from '../services/bedService';
import { ERROR_SERVER } from '../utils';

export const getAllBedsController = async (req, res) => {
    try {
        let response = await getAllBeds();
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

export const getBedByRoomController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.roomId) {
            let response = await getBedByRoom(data.roomId);
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

export const getBedByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getBedById(data.id);
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

export const getBedEmptyController = async (req, res) => {
    try {
        let response = await getBedEmpty();
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

export const createBedController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.roomId) {
            let response = await createBed(data);
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

export const updateBedController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.roomId) {
            let response = await updateBed(data);
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

export const deleteBedController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteBed(data.id);
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

