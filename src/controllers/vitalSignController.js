import vitalSignService from '../services/vitalSignService';

const getVitalSignByExamId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await vitalSignService.getVitalSignByExamId(data.examinationId);
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

const createVitalSign = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.height && data.weight && data.fetalWeight !== undefined
            && data.pulse && data.temperature && data.hightBloodPressure && data.lowBloodPressure
            && data.breathingRate && data.glycemicIndex) {
            let response = await vitalSignService.createVitalSign(data);
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

const updateVitalSign = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.height && data.weight && data.fetalWeight !== undefined
            && data.pulse && data.temperature && data.hightBloodPressure && data.lowBloodPressure
            && data.breathingRate && data.glycemicIndex) {
            let response = await vitalSignService.updateVitalSign(data);
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

const deleteVitalSign = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await vitalSignService.deleteVitalSign(data.examinationId);
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

const createOrUpdateVitalSign = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.height && data.weight && data.fetalWeight !== undefined
            && data.pulse && data.temperature && data.hightBloodPressure && data.lowBloodPressure
            && data.breathingRate && data.glycemicIndex) {
            let response = await vitalSignService.createOrUpdateVitalSign(data);
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
    getVitalSignByExamId,
    createVitalSign,
    updateVitalSign,
    deleteVitalSign,
    createOrUpdateVitalSign
}