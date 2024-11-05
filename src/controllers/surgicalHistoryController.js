import surgicalHistoryService from '../services/surgicalHistoryService';

const getAllSurgicalHistories = async (req, res) => {
    try {
        let response = await surgicalHistoryService.getAllSurgicalHistories();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            EC: 500,
            EM: "Error from server",
            DT: "",
        });
    }
}

const getSurgicalHistoryById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await surgicalHistoryService.getSurgicalHistoryById(data.id);
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
            EM: "Error from server",
            DT: "",
        });
    }
}

const createSurgicalHistory = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.diseaseName && data.bodyPart) {
            let response = await surgicalHistoryService.createSurgicalHistory(data);
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
            EM: "Error from server",
            DT: "",
        });
    }
}

const updateSurgicalHistory = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.diseaseName && data.bodyPart) {
            let response = await surgicalHistoryService.updateSurgicalHistory(data);
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
            EM: "Error from server",
            DT: "",
        });
    }
}

const deleteSurgicalHistory = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await surgicalHistoryService.deleteSurgicalHistory(data.id);
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
            EM: "Error from server",
            DT: "",
        });
    }
}

module.exports = {
    getAllSurgicalHistories,
    getSurgicalHistoryById,
    createSurgicalHistory,
    updateSurgicalHistory,
    deleteSurgicalHistory,
}