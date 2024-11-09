import specialtyService from '../services/specialtyService';
let createSpecialty = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
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
            EM: "Error from server",
            DT: "",
        }
    }
}
module.exports = {
    createSpecialty,
    getSpecialtySelect
}