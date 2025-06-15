import e from 'express';
import { arrangeSchedule, createSchedule, deleteSchedule, getAllSchedules, getAllSchedulesAdmin, getScheduleByDateAndDoctor, getScheduleByStaffId, getScheduleByStaffIdFromToday, getScheduleInWeek, updateScheduleStaff } from '../services/scheduleService';
import { ERROR_SERVER } from '../utils';


export const getAllSchedulesController = async (req, res) => {
    try {
        let response = await getAllSchedules();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getScheduleByStaffIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.staffId) {
            let response = await getScheduleByStaffId(data.staffId);
            res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getScheduleInWeekController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.from && data.to) {
            let response = await getScheduleInWeek(data);
            res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createScheduleController = async (req, res) => {
    try {
        let data = req.body;
        let response = await createSchedule(data);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const updateScheduleStaffController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.newStaffId && data.oldStaffId && data.roomId && data.date) {
            let response = await updateScheduleStaff(data);
            res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteScheduleController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.staffId && data.roomId && data.date) {
            let response = await deleteSchedule(data);
            res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const arrangScheduleController = async (req, res) => {
    try {
        let data = req.body;
        let response = await arrangeSchedule(data);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getAllSchedulesAdminController = async (req, res) => {
    try {
        let response = await getAllSchedulesAdmin(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getScheduleByStaffIdFromTodayController = async (req, res) => {
    try {
        let response = await getScheduleByStaffIdFromToday(req.user.staff);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getScheduleByDateAndDoctorController = async (req, res) => {
    try {
        let response = await getScheduleByDateAndDoctor(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}