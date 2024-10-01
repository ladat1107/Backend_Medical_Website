import db from "../models/index";

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
    createAppointment,
    deleteAppointment,
}