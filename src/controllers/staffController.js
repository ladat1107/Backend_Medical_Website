import staffService from '../services/staffService';

const getAllStaff = async (req, res) => {
    try {
        let response = await staffService.getAllStaff();
        res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}

const getStaffbyDepartmentId = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.departmentId){
            let response = await staffService.getStaffbyDepartmentId(data.departmentId);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
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

const getStaffById = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.id){
            let response = await staffService.getStaffById(data.id);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
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

const getStaffByRole = async (req, res) => {
    try {
        let data = req.query;
        if(data && data.roleId){
            let response = await staffService.getStaffByRole(data.roleId);
            res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(400).json({
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

module.exports = {
    getAllStaff,
    getStaffbyDepartmentId,
    getStaffById,
    getStaffByRole
}