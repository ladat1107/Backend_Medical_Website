import specialtyService from '../services/specialtyService';
import { PAGINATE } from '../utils';
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
        if (!data || !data.name || !data.image) {
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
let getAllSpecialtyAdmin = async (req, res) => {
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
            let response = await specialtyService.getAllSpecialtyAdmin(page, limitValue, search);
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            })
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        }
    }
}
let getSpecialtyById = async (req, res) => {
    try {
        let data = req.query;
        if (!data || !data.id) {
            return res.status(400).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await specialtyService.getSpecialtyById(data.id);
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
    getAllSpecialtyAdmin,
    getSpecialtyById,
}