import { blockSpecialty, createSpecialty, deleteSpecialty, getAllSpecialtyAdmin, getSpcialtyHome, getSpecialtiesByDepartment, getSpecialtiesByLaboratory, getSpecialtyById, getSpecialtySelect, updateSpecialty } from '../services/specialtyService';
export const getSpecialtySelectController = async (req, res) => {
    try {
        let response = await getSpecialtySelect();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getSpcialtyHomeController = async (req, res) => {
    try {
        let response = await getSpcialtyHome(req.query);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const createSpecialtyController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.name || !data.image) {
            return res.status(200).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await createSpecialty(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const updateSpecialtyController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(200).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await updateSpecialty(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const blockSpecialtyController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(200).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await blockSpecialty(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteSpecialtyController = async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.id) {
            return res.status(200).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await deleteSpecialty(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getAllSpecialtyAdminController = async (req, res) => {
    try {
        let page = req.query?.page || 1;
        let limit = req.query?.limit || 25;
        let search = req.query?.search || "";
        let response = await getAllSpecialtyAdmin(page, limit, search);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const getSpecialtyByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (!data || !data.id) {
            return res.status(200).json({
                EC: 400,
                EM: "Thiếu thông tin",
                DT: ""
            })
        }
        let response = await getSpecialtyById(data.id);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getSpecialtiesByDepartmentController = async (req, res) => {
    try {
        let response = await getSpecialtiesByDepartment();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getSpecialtiesByLaboratoryController = async (req, res) => {
    try {
        const labId = req.query.labId;
        let response = await getSpecialtiesByLaboratory(labId);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
