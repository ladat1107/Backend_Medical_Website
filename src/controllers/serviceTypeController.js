import serviceTypeService from '../services/serviceTypeService';
import { PAGINATE } from '../utils';

const getAllServiceTypes = async (req, res) => {
    try {
        let response = await serviceTypeService.getAllServiceTypes();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}
const getAllServiceTypesAdmin = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            let limitValue = 25;
            for (let i = 0; i < PAGINATE.length; i++) {
                if (PAGINATE[i].id === limit) {
                    limitValue = PAGINATE[i].value;
                    break;
                }
            }
            let search = req.query.search;
            let response = await serviceTypeService.getAllServiceTypesAdmin(page, limitValue, search);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}
const getServiceSearch = async (req, res) => {
    try {

        let response = await serviceTypeService.getServiceSearch();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}
const getServiceTypeById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await serviceTypeService.getServiceTypeById(data.id);
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const createServiceType = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.price) {
            let response = await serviceTypeService.createServiceType(data);
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const updateServiceType = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id && data.name && data.price) {
            let response = await serviceTypeService.updateServiceType(data);
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

const blockStatusServiceType = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await serviceTypeService.blockStatusServiceType(data.id);
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}
const deleteStatusServiceType = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await serviceTypeService.deleteStatusServiceType(data.id);
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
            EM: "Hệ thống quá tải!",
            DT: ""
        })
    }
}

module.exports = {
    getAllServiceTypes,
    getServiceTypeById,
    createServiceType,
    updateServiceType,
    blockStatusServiceType,
    deleteStatusServiceType,
    getAllServiceTypesAdmin,
    getServiceSearch,
}