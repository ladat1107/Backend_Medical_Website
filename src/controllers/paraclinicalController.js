import paraclinicalService from '../services/paraclinicalService';

const getParaclinicalByExamId = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.examinationId) {
            let response = await paraclinicalService.getParaclinicalByExamId(data.examinationId);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createRequestParaclinical = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.listParaclinicals) {
            let response = await paraclinicalService.createRequestParaclinical(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const createParaclinical = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.paraclinical && data.price
            // && data.description
            // && data.result && data.image && data.doctorId
        ) {
            let response = await paraclinicalService.createParaclinical(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const updateParaclinical = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id
            // && data.paraclinical 
            // && data.description
            // && data.result && data.image && data.price
        ) {
            let response = await paraclinicalService.updateParaclinical(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const deleteParaclinical = async (req, res) => {
    try {
        let { id, examinationId } = req.query;
        if (id !== undefined && examinationId !== undefined) {
            let response = await paraclinicalService.deleteParaclinical({ id, examinationId });
            return res.status(200).json({
                EC: response.EC,
                EM: response.EM,
                DT: response.DT
            });
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Dữ liệu không được trống!",
                DT: ""
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        });
    }
}


const createOrUpdateParaclinical = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.examinationId && data.paraclinical && data.description
            && data.result && data.image && data.price && data.doctorId !== undefined) {
            let response = await paraclinicalService.createOrUpdateParaclinical(data);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

const getExaminations = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        let is_appointment = req.query.is_appointment || null;
        let time = req.query.time || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await examinationService.getExaminations(date, status, staffId, +page, +limit, search, time);
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

const getParaclinicals = async (req, res) => {
    try {
        let date = req.query.date || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await paraclinicalService.getParaclinicals(date, status, staffId, +page, +limit, search);
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

const updateListPayParaclinicals = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.ids) {
            let response = await paraclinicalService.updateListPayParaclinicals(data.ids, req.user.id);
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
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

module.exports = {
    getParaclinicalByExamId,
    createParaclinical,
    updateParaclinical,
    deleteParaclinical,
    createOrUpdateParaclinical,
    createRequestParaclinical,
    getParaclinicals,
    updateListPayParaclinicals
}