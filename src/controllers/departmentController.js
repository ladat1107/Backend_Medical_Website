import departmentService from '../services/departmentService';
import { PAGINATE } from '../utils';

const getAllDepartment = async (req, res) => {
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
            let response = await departmentService.getAllDepartment(page, limitValue, search,);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const getAllNameDepartment = async (req, res) => {
    try {
        let response = await departmentService.getAllNameDepartment();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const getDepartmentById = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await departmentService.getDepartmentById(data.id);
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
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getAllStaffInDepartment = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await departmentService.getAllStaffInDepartment(data.id);
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
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createDepartment = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.image && data.deanId && data.address && data.markDownContent && data.htmlContent) {
            let response = await departmentService.createDepartment(data);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
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

const updateDepartment = async (req, res) => {
    try {
        let data = req.body
        if (data && data.id && data.name && data.image && data.deanId && data.address
            && data.markDownContent && data.htmlContent) {
            let response = await departmentService.updateDepartment(data)
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const deleteDepartment = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await departmentService.deleteDepartment(data.id);
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
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const blockDepartment = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await departmentService.blockDepartment(data.id);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}
const getDepartmentHome = async (req, res) => {
    try {
        let response = await departmentService.getDepartmentHome();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
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
    getAllNameDepartment,
    getAllDepartment,
    getDepartmentById,
    getAllStaffInDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    blockDepartment,
    getDepartmentHome,
}