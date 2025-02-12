import familyHistoryService from '../services/familyHistoryService';

const getAllFamilyHistories = async (req, res) => {
    try {
        let response = await familyHistoryService.getAllFamilyHistories();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getFamilyHistoryById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await familyHistoryService.getFamilyHistoryById(data.id);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getFamilyHistoriesByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await familyHistoryService.getFamilyHistoriesByUserId(data.userId);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createFamilyHistory = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.relationship && data.diseaseGroup && data.diseaseName && data.medicalFacilityRecords
            && data.description && data.discoveryDate && data.illnessDuration && data.userId) {
            let response = await familyHistoryService.createFamilyHistory(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const updateFamilyHistory = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.relationship && data.diseaseGroup && data.diseaseName && data.medicalFacilityRecords
            && data.description && data.discoveryDate && data.illnessDuration) {
            let response = await familyHistoryService.updateFamilyHistory(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const deleteFamilyHistory = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await familyHistoryService.deleteFamilyHistory(data.id);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

module.exports = {
    getAllFamilyHistories,
    getFamilyHistoryById,
    getFamilyHistoriesByUserId,
    createFamilyHistory,
    updateFamilyHistory,
    deleteFamilyHistory
}