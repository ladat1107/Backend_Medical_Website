import { blockRoom, createRoom, deleteRoom, getAllRooms, getAvailableRooms, getRoomByDepartment, getRoomById, updateRoom } from '../services/roomService';
import { ERROR_SERVER } from '../utils';

export const getAllRoomAdminController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 25;
        let search = req.query?.search || "";
        let filter = req?.query?.filter || null;
        let response = await getAllRooms(page, limit, search, filter);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getRoomByDepartmentController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.departmentId) {
            let response = await getRoomByDepartment(data.departmentId);
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

export const getRoomByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getRoomById(data.id);
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

export const createRoomController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.departmentId && data.capacity && data.serviceIds.length > 0) {
            let response = await createRoom(data);
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

export const updateRoomController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.departmentId && data.serviceIds.length > 0) {
            let response = await updateRoom(data);
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

export const blockRoomController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await blockRoom(data.id);
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
export const deleteRoomController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteRoom(data.id);
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

export const getAvailableRoomsController = async (req, res) => {
    try {
        let medicalTreatmentTier = req.query.medicalTreatmentTier || null;
        let response = await getAvailableRooms(medicalTreatmentTier);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
