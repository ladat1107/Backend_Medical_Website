import specialtyService from '../services/specialtyService';
let createSpecialty = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}
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
            EM: "Hệ thống quá tải!",
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
module.exports = {
    createSpecialty,
    getSpecialtySelect,
    getSpcialtyHome,
}