import appointmentService from '../services/appointmentService';

const getAllAppointments = async (req, res) => {
    try{
        let response = await appointmentService.getAllAppointments();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getAllAppointmentsByDate = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.date) {
            let response = await appointmentService.getAllAppointmentsByDate(data.date);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getAppointmentByUserId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.userId) {
            let response = await appointmentService.getAppointmentByUserId(data.userId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getAppointmentByStaffId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.staffId) {
            let response = await appointmentService.getAppointmentByStaffId(data.staffId);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const searchAppointment = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.page && data.limit) {
            let response = await appointmentService.seachAppointment(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const seachAppointmentWithStaffId = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.page && data.limit && data.staffId) {
            let response = await appointmentService.seachAppointmentWithStaffId(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const createAppointment = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.userId && data.staffId && data.date && data.time && data.cid && data.symptom !== undefined && data.specialNote !== undefined) {
            let response = await appointmentService.createAppointment(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const deleteAppointment = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.userId && data.staffId && data.date && data.cid) {
            let response = await appointmentService.deleteAppointment(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getAllAppointments,
    getAllAppointmentsByDate,
    getAppointmentByUserId,
    getAppointmentByStaffId,
    searchAppointment,
    seachAppointmentWithStaffId,
    createAppointment,
    deleteAppointment
}