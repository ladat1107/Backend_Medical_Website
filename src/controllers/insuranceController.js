import insuranceService from "../services/insuranceService";

const getInsuranceById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await insuranceService.getInsuranceById(data.id);
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

const getInsuranceByUserId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await insuranceService.getInsuranceByUserId(data.userId);
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

const createInsurance = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.insuanceCode && data.dateOfIssue && data.exp && data.benefitLevel && data.residentialCode && data.initialHealthcareRegistrationCode && data.continuousFiveYearPeriod && data.userId) {
            let response = await insuranceService.createInsurance(data);
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

const updateInsurance = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.insuanceCode && data.dateOfIssue && data.exp && data.benefitLevel && data.residentialCode && data.initialHealthcareRegistrationCode && data.continuousFiveYearPeriod) {
            let response = await insuranceService.updateInsurance(data);
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

const deleteInsurance = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await insuranceService.deleteInsurance(data.id);
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
    getInsuranceById,
    getInsuranceByUserId,
    createInsurance,
    updateInsurance,
    deleteInsurance
}