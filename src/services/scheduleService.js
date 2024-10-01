import db from "../models/index";
const { Op } = require('sequelize');

const getAllSchedules = async () => {
    try{
        let schedule = await db.Schedule.findAll({
            include: [{
                model: db.Staff,
                as: 'scheduleStaffData',
                attributes: ['id', 'departmentId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const getScheduleByStaffId = async (staffId) => {
    try{
        let schedule = await db.Schedule.findAll({
            where: {staffId: staffId},
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const getScheduleInWeek = async (data) => {
    try{
        let schedule = await db.Schedule.findAll({
            where: {
                date: {
                    [Op.gte]: +data.from, 
                    [Op.lte]: +data.to,   
                }
            },
            include: [{
                model: db.Staff,
                as: 'scheduleStaffData',
                attributes: ['id', 'departmentId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const createSchedule = async (data) => {
    try{
        let schedule = await db.Schedule.create({
            staffId: data.staffId,
            roomId: data.roomId,
            date: data.date,
        });
        return {
            EC: 0,
            EM: "Tạo thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const updateScheduleStaff = async (data) => {
    try{
        let schedule = await db.Schedule.update({
            staffId: data.newStaffId
        }, {
            where: {roomId: data.roomId, staffId: data.oldStaffId , date: data.date},
        });
        return {
            EC: 0,
            EM: "Cập nhật thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

const deleteSchedule = async (data) => {
    try{
        let schedule = await db.Schedule.destroy({
            where: {staffId: data.staffId, roomId: data.roomId, date: data.date},
        });
        return {
            EC: 0,
            EM: "Xóa thông tin lịch trực thành công",
            DT: schedule
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: "",
        }
    }
}

module.exports = {
    getAllSchedules,
    getScheduleByStaffId,
    getScheduleInWeek,
    createSchedule,
    updateScheduleStaff,
    deleteSchedule,
}