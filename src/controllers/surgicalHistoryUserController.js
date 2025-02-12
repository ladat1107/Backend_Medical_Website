import surgicalHistoryUserService from '../services/surgicalHistoryUserService';

const getAllSurgicalHistoryUser = async (req, res) => {
    try {
        let response = await surgicalHistoryUserService.getAllSurgicalHistoryUser();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

const getSurgicalHistoryUserByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await surgicalHistoryUserService.getSurgicalHistoryUserByUserId(data.userId);
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
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

const getSurgicalHistoryUserBySurgicalHistoryId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.surgicalhistoryId) {
            let response = await surgicalHistoryUserService.getSurgicalHistoryUserBySurgicalHistoryId(data.surgicalhistoryId);
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
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

const createSurgicalHistoryUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.surgicalhistoryId && data.description && data.implementationDate && data.medicalFacilityRecords) {
            let response = await surgicalHistoryUserService.createSurgicalHistoryUser(data);
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
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

const updateSurgicalHistoryUser = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.surgicalhistoryId && data.description && data.implementationDate && data.medicalFacilityRecords) {
            let response = await surgicalHistoryUserService.updateSurgicalHistoryUser(data);
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
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

const deleteSurgicalHistoryUser = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId && data.surgicalhistoryId) {
            let response = await surgicalHistoryUserService.deleteSurgicalHistoryUser(data.userId, data.surgicalhistoryId);
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
        return res.status(500).send({
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        });
    }
}

module.exports = {
    getAllSurgicalHistoryUser,
    getSurgicalHistoryUserByUserId,
    getSurgicalHistoryUserBySurgicalHistoryId,
    createSurgicalHistoryUser,
    updateSurgicalHistoryUser,
    deleteSurgicalHistoryUser
}