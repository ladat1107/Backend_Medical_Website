import allergyUserService from '../services/allergyUserService';

const getAllAllergyUsers = async (req, res) => {
    try {
        let response = await allergyUserService.getAllAllergyUsers();
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

const getAllergyUserByUserId = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.userId) {
            let response = await allergyUserService.getAllergyUserByUserId(data.userId);
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

const getAllergyUserByAllergyId = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.allergyId) {
            let response = await allergyUserService.getAllergyUserByAllergyId(data.allergyId);
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

const createAllergyUser = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.userId && data.allergyId && data.discoveryDate) {
            let response = await allergyUserService.createAllergyUser(data);
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

const updateAllergyUser = async (req, res) => {
    try{
        let data = req.body;
        if(data && data.userId && data.allergyId && data.discoveryDate) {
            let response = await allergyUserService.updateAllergyUser(data);
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

const deleteAllergyUser = async (req, res) => {
    try{
        let data = req.query;
        if(data && data.userId && data.allergyId) {
            let response = await allergyUserService.deleteAllergyUser(data);
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
    getAllAllergyUsers,
    getAllergyUserByUserId,
    getAllergyUserByAllergyId,
    createAllergyUser,
    updateAllergyUser,
    deleteAllergyUser
}