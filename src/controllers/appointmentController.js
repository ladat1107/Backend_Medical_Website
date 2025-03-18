import { createAppointment, deleteAppointment, getAllAppointments, getAllAppointmentsByDate, getAppointmentByStaffId, getAppointmentByUserId, seachAppointment, seachAppointmentWithStaffId } from '../services/appointmentService';
import { ERROR_SERVER } from '../utils';

export const getAllAppointmentsController = async (req, res) => {
    try {
        let response = await getAllAppointments();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getAllAppointmentsByDateController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.date) {
            let response = await getAllAppointmentsByDate(data.date);
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

export const getAppointmentByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getAppointmentByUserId(data.userId);
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

export const getAppointmentByStaffIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.staffId) {
            let response = await getAppointmentByStaffId(data.staffId);
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

export const searchAppointmentController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.page && data.limit) {
            let response = await seachAppointment(data);
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

export const seachAppointmentWithStaffIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.page && data.limit && data.staffId) {
            let response = await seachAppointmentWithStaffId(data);
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

export const createAppointmentController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.staffId && data.date && data.time && data.cid && data.symptom !== undefined && data.specialNote !== undefined) {
            let response = await createAppointment(data);
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

export const deleteAppointmentController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.staffId && data.date && data.cid) {
            let response = await deleteAppointment(data);
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

