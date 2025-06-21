import { createInsurance, deleteInsurance, getInsuranceById, getInsuranceByUserId, updateInsurance } from "../services/insuranceService";
import { ERROR_SERVER } from "../utils";

export const getInsuranceByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getInsuranceById(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getInsuranceByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.userId) {
            let response = await getInsuranceByUserId(data.userId);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createInsuranceController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.insuranceCode && data.benefitLevel && data.userId) {
            let response = await createInsurance(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updateInsuranceController = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        if (data && data.id && data.insuranceCode && data.benefitLevel && data.userId) {
            let response = await updateInsurance(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const deleteInsuranceController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await deleteInsurance(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
