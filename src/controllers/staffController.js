import { getAllStaff, getStaffbyDepartmentId, getStaffById, getStaffByName, getStaffByRole, getStaffNameById, profileStaff } from '../services/staffService';
import { ERROR_SERVER } from '../utils';

export const getAllStaffController = async (req, res) => {
    try {
        let response = await getAllStaff();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getStaffbyDepartmentIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.departmentId) {
            let response = await getStaffbyDepartmentId(data.departmentId);
            return res.status(200).json(response);
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

export const getStaffByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getStaffById(data.id);
            res.status(200).json(response);
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

export const getStaffNameByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.staffId) {
            let response = await getStaffNameById(data.staffId);
            res.status(200).json(response);
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

export const getStaffByRoleController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.roleId) {
            let response = await getStaffByRole(data.roleId);
            res.status(200).json(response);
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

export const getStaffByNameController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.name) {
            let response = await getStaffByName(data.name);
            res.status(200).json(response);
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
export const profileStaffController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.htmlDescription && data.shortDescription) {
            let response = await profileStaff(data);
            res.status(200).json(response);
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
