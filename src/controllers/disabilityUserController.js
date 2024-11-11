import disabilityUserServices from '../services/disabilityUserService';

const getAllDisabilityUsers = async (req, res) => {
    try {
        let response = await disabilityUserServices.getAllDisabilityUser();
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

const getDisabilityUserByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await disabilityUserServices.getDisabilityUserByUserId(data.userId);
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

const getDisabilityUserByDisabilityId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.disabilityId) {
            let response = await disabilityUserServices.getDisabilityUserByDisabilityId(data.disabilityId);
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

const createDisabilityUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.disabilityId && data.description && data.medicalFacilityRecords) {
            let response = await disabilityUserServices.createDisabilityUser(data);
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

const updateDisabilityUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.disabilityId && data.description && data.medicalFacilityRecords) {
            let response = await disabilityUserServices.updateDisabilityUser(data);
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

const deleteDisabilityUser = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId && data.disabilityId) {
            let response = await disabilityUserServices.deleteDisabilityUser(data);
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
    getAllDisabilityUsers,
    getDisabilityUserByUserId,
    getDisabilityUserByDisabilityId,
    createDisabilityUser,
    updateDisabilityUser,
    deleteDisabilityUser
}