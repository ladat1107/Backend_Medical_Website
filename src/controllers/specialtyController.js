import specialtyService from '../services/specialtyService';
let getSpecialtySelect = async (req, res) => {
    try {
        let response = await specialtyService.getSpecialtySelect();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
const getSpcialtyHome = async (req, res) => {
    try {
        let response = await specialtyService.getSpcialtyHome();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi hệ thống",
            DT: ""
        })
    }
}
let createSpecialty = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.name || !data.iamge) {
            return res.status(400).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await specialtyService.createSpecialty(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
let updateSpecialty = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(400).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await specialtyService.updateSpecialty(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
let blockSpecialty = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(400).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await specialtyService.blockSpecialty(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
let deleteSpecialty = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(400).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await specialtyService.deleteSpecialty(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
module.exports = {
    createSpecialty,
    getSpecialtySelect,
    getSpcialtyHome,
    updateSpecialty,
    blockSpecialty,
    deleteSpecialty,
}