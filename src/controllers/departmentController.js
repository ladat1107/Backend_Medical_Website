import { blockDepartment, createDepartment, deleteDepartment, getAllDepartment, getAllNameDepartment, getAllStaffInDepartment, getDepartmentById, getDepartmentDuty, getDepartmentHome, updateDepartment } from '../services/departmentService';
import { ERROR_SERVER } from '../utils';

export const getAllDepartmentController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 25;
        let search = req.query?.search || "";
        let response = await getAllDepartment(page, limit, search);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getAllNameDepartmentController = async (req, res) => {
    try {
        let response = await getAllNameDepartment();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getDepartmentByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getDepartmentById(data.id);
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
        return res.status(200).json(ERROR_SERVER)
    }
}

export const getAllStaffInDepartmentController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getAllStaffInDepartment(data.id);
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
        return res.status(200).json(ERROR_SERVER)
    }
}

export const createDepartmentController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.image && data.deanId && data.address && data.markDownContent && data.htmlContent) {
            let response = await createDepartment(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updateDepartmentController = async (req, res) => {
    try {
        let data = req.body
        if (data && data.id && data.name && data.image && data.deanId && data.address
            && data.markDownContent && data.htmlContent) {
            let response = await updateDepartment(data)
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteDepartmentController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteDepartment(data.id);
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
        return res.status(200).json(ERROR_SERVER)
    }
}
export const blockDepartmentController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await blockDepartment(data.id);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json(ERROR_SERVER)
    }
}
export const getDepartmentHomeController = async (req, res) => {
    try {
        let response = await getDepartmentHome();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getDepartmentDutyController = async (req, res) => {
    try {
        let response = await getDepartmentDuty();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
