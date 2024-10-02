import db from "../models/index";
import { getTodayTimestamp } from "../utils/getTodayTimestamp";
const { Op } = require('sequelize');

const getAllAppointments = async () => {
    try{
        let appointment = await db.Appointment.findAll({
            include: [{
                model: db.User,
                as: 'appointmentUserData',
                attributes: ['id', 'lastName', 'firstName'],
            }, {
                model: db.Staff,
                as: 'appointmentStaffData',
                attributes: ['id', 'departmentId', 'price'],
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
            EM: "Lấy thông tin lịch hẹn thành công",
            DT: appointment
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

const getAllAppointmentsByDate = async (date) => {
    try{
        let appointment = await db.Appointment.findAll({
            where: {date: +date},
            include: [{
                model: db.User,
                as: 'appointmentUserData',
                attributes: ['id', 'lastName', 'firstName'],
            }, {
                model: db.Staff,
                as: 'appointmentStaffData',
                attributes: ['id', 'departmentId', 'price'],
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
            EM: "Lấy thông tin lịch hẹn thành công",
            DT: appointment
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

const getAppointmentByUserId = async (userId) => {
    try{
        let appointment = await db.Appointment.findAll({
            where: {userId: userId},
            include: [{
                model: db.User,
                as: 'appointmentUserData',
                attributes: ['id', 'lastName', 'firstName'],
            }, {
                model: db.Staff,
                as: 'appointmentStaffData',
                attributes: ['id', 'departmentId', 'price'],
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
            EM: "Lấy thông tin lịch hẹn thành công",
            DT: appointment
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

const getAppointmentByStaffId = async (staffId) => {
    try{
        let appointment = await db.Appointment.findAll({
            where: {staffId: staffId},
            include: [{
                model: db.User,
                as: 'appointmentUserData',
                attributes: ['id', 'lastName', 'firstName'],
            }, {
                model: db.Staff,
                as: 'appointmentStaffData',
                attributes: ['id', 'departmentId', 'price'],
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
            EM: "Lấy thông tin lịch hẹn thành công",
            DT: appointment
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

const seachAppointment = async (data) => {
    try{
        if(!data.search) data.search = "";
        if(data.from == '') data.from = 0;
        if(data.to == '') data.to = getTodayTimestamp();

        let appointment = await db.Appointment.findAll({
            where: {
                date: {
                    [Op.gte]: +data.from, 
                    [Op.lte]: +data.to,   
                },
            },
            include: [{
                model: db.User,
                as: 'appointmentUserData',
                attributes: ['id', 'lastName', 'firstName'],
                required: true,
                where: {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${data.search}%` } },
                        { lastName: { [Op.like]: `%${data.search}%` } },
                    ]
                }
            }, {
                model: db.Staff,
                as: 'appointmentStaffData',
                attributes: ['id', 'departmentId', 'price'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }],
            offset: (+data.page - 1) * +data.limit,
            limit: +data.limit,
            raw: true,
            nest: true,
        });        
        return {
            EC: 0,
            EM: "Lấy thông tin lịch hẹn thành công",
            DT: appointment
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

const createAppointment = async (data) => {
    try{
        let appointment = await db.Appointment.create({
            userId: data.userId,
            staffId: data.staffId,
            date: data.date,
            time: data.time,
            cid: data.cid,
            symptom: data.symptom,
            specialNote: data.specialNote,
        });
        return {
            EC: 0,
            EM: "Tạo lịch hẹn thành công",
            DT: appointment
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

const deleteAppointment = async (data) => {
    try{
        let appointment = await db.Appointment.destroy({
            where: {userId: data.userId, staffId: data.staffId, date: data.date, cid: data.cid},
        });
        return {
            EC: 0,
            EM: "Xóa lịch hẹn thành công",
            DT: appointment
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
    getAllAppointments,
    getAllAppointmentsByDate,
    getAppointmentByUserId,
    getAppointmentByStaffId,
    seachAppointment,
    createAppointment,
    deleteAppointment,
}