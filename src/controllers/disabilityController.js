import disabilityService from '../services/disabilityService';

const getAllDisabilities = async (req, res) => {
    try {
        let response = await disabilityService.getAllDisability();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const getDisabilityById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await disabilityService.getDisabilityById(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
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

const createDisability = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.bodyPart) {
            let response = await disabilityService.createDisability(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
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

const updateDisability = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.bodyPart) {
            let response = await disabilityService.updateDisability(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
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

const deleteDisability = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await disabilityService.deleteDisability(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
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
    getAllDisabilities,
    getDisabilityById,
    createDisability,
    updateDisability,
    deleteDisability
}