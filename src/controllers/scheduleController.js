import scheduleService from '../services/scheduleService';

const getAllSchedules = async (req, res) => {
    try {
        let response = await scheduleService.getAllSchedules();
        res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const getScheduleByStaffId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.staffId) {
            let response = await scheduleService.getScheduleByStaffId(data.staffId);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const getScheduleInWeek = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.from && data.to) {
            let response = await scheduleService.getScheduleInWeek(data);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const createSchedule = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.staffId && data.roomId && data.date) {
            let response = await scheduleService.createSchedule(data);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const updateScheduleStaff = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.newStaffId && data.oldStaffId && data.roomId && data.date) {
            let response = await scheduleService.updateScheduleStaff(data);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const deleteSchedule = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.staffId && data.roomId && data.date) {
            let response = await scheduleService.deleteSchedule(data);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

module.exports = {
    getAllSchedules,
    getScheduleByStaffId,
    getScheduleInWeek,
    createSchedule,
    updateScheduleStaff,
    deleteSchedule
}