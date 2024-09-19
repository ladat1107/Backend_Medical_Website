import departmentService from '../services/departmentService';

const getAllDepartment = async (req, res) => {
    try {
        let response = await departmentService.getAllDepartment();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
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
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Error from server",
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
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const createDepartment = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.name && data.image && data.deanId && data.address && data.markDownContent && data.htmlContent){
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
            EM: "Error from server",
            DT: ""
        })
    }
}

const updateDepartment = async (req, res) => {
    try{
        let data = req.body
        if(data && data.id && data.name && data.image && data.deanId && data.address 
            && data.markDownContent && data.htmlContent){
            let response = await departmentService.updateDepartment(data)
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        } else {
            return res.status(400).json({
                EC: 400,
                EM: "Dữ liệu không được để trống",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
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
                EM: "Input is empty",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

module.exports = {
    getAllDepartment,
    getDepartmentById,
    getAllStaffInDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}