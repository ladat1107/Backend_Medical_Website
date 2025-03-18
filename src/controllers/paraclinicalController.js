import { getExaminations } from '../services/examinationService';
import { createOrUpdateParaclinical, createParaclinical, createRequestParaclinical, deleteParaclinical, getParaclinicalByExamId, getParaclinicals, updateListPayParaclinicals, updateParaclinical } from '../services/paraclinicalService';
import { ERROR_SERVER } from '../utils';

export const getParaclinicalByExamIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await getParaclinicalByExamId(data.examinationId);
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

export const createRequestParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.listParaclinicals) {
            let response = await createRequestParaclinical(data);
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

export const createParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.paraclinical && data.price
            // && data.description
            // && data.result && data.image && data.doctorId
        ) {
            let response = await createParaclinical(data);
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

export const updateParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id
            // && data.paraclinical 
            // && data.description
            // && data.result && data.image && data.price
        ) {
            let response = await updateParaclinical(data);
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

export const deleteParaclinicalController = async (req, res) => {
    try {
        let { id, examinationId } = req.query;
        if (id !== undefined && examinationId !== undefined) {
            let response = await deleteParaclinical({ id, examinationId });
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER);
    }
}


export const createOrUpdateParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.paraclinical && data.description
            && data.result && data.image && data.price && data.doctorId !== undefined) {
            let response = await createOrUpdateParaclinical(data);
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

export const getExaminationsController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        let is_appointment = req.query.is_appointment || null;
        let time = req.query.time || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getExaminations(date, status, staffId, +page, +limit, search, time);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getParaclinicalsController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getParaclinicals(date, status, staffId, +page, +limit, search);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updateListPayParaclinicalsController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.ids) {
            let response = await updateListPayParaclinicals(data.ids, req.user.id);
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
