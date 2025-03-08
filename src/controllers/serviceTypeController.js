import  { blockStatusServiceType, createServiceType, deleteStatusServiceType, getAllServiceTypes, getAllServiceTypesAdmin, getServiceLaboratory, getServiceSearch, getServiceTypeById, updateServiceType } from '../services/serviceTypeService';
import { ERROR_SERVER } from '../utils';

export const getAllServiceTypesController = async (req, res) => {
    try {
        let response = await getAllServiceTypes();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getAllServiceTypesAdminController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 25;
        let search = req.query?.search || "";
        let response = await getAllServiceTypesAdmin(page, limit, search);
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
export const getServiceSearchController = async (req, res) => {
    try {

        let response = await getServiceSearch();
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
export const getServiceTypeByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getServiceTypeById(data.id);
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

export const createServiceTypeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.price) {
            let response = await createServiceType(data);
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

export const updateServiceTypeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.price) {
            let response = await updateServiceType(data);
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

export const blockStatusServiceTypeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await blockStatusServiceType(data.id);
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
export const deleteStatusServiceTypeController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await deleteStatusServiceType(data.id);
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

export const getServiceLaboratoryController = async (req, res) => {
    try {
        let response = await getServiceLaboratory();
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
