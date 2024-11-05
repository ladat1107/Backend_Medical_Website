import conditionAtBirthService from '../services/conditionAtBirthService';

const getConditionAtBirthById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await conditionAtBirthService.getConditionAtBirthById(data.id);
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const getConditionAtBirthByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await conditionAtBirthService.getConditionAtBirthByUserId(data.userId);
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const createConditionAtBirth = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.typeOfBirth && data.weight && data.height && data.detail) {
            let response = await conditionAtBirthService.createConditionAtBirth(data);
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const updateConditionAtBirth = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.typeOfBirth && data.weight && data.height && data.detail) {
            let response = await conditionAtBirthService.updateConditionAtBirth(data);
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const deleteConditionAtBirth = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await conditionAtBirthService.deleteConditionAtBirth(data.id);
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
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getConditionAtBirthById,
    getConditionAtBirthByUserId,
    createConditionAtBirth,
    updateConditionAtBirth,
    deleteConditionAtBirth
}