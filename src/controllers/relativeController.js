import relativeService from '../services/relativeService';

const getAllRelatives = async (req, res) => {
    try {
        let response = await relativeService.getAllRelatives();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getRelativesByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await relativeService.getRelativesByUserId(data.userId);
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getRelativeById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await relativeService.getRelativeById(data.id);
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const createRelative = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.fullName && data.cid && data.phoneNumber && data.relationship && data.address && data.userId && data.email !== undefined) {  
            let response = await relativeService.createRelative(data);
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const updateRelative = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.fullName && data.cid && data.phoneNumber && data.relationship && data.address && data.email !== undefined) {
            let response = await relativeService.updateRelative(data);
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const deleteRelative = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await relativeService.deleteRelative(data.id);
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getAllRelatives,
    getRelativesByUserId,
    getRelativeById,
    createRelative,
    updateRelative,
    deleteRelative
}