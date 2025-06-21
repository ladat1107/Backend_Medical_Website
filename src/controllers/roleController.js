import { createRole, getAllRoles, getRoleById, updateRole } from '../services/roleService';
import { ERROR_SERVER } from '../utils';

export const getAllRolesController = async (req, res) => {
    try {
        let response = await getAllRoles();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getRoleByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getRoleById(data.id);
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

export const createRoleController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name) {
            let response = await createRole(data);
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

export const updateRoleController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.status !== undefined) {
            let response = await updateRole(data);
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
