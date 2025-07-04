import { blockAppointment, createAppointment, createExamination, deleteAppointment, deleteExamination, getExaminationById, getExaminationByIdAdmin, getExaminationByUserId, getExaminations, getExamToNotice, getListAdvanceMoney, getListInpations, getListToPay, getMedicalRecords, getPatienSteps, getScheduleApoinment, getStatisticsExamination, updateExamination, updateInpatientRoom, updateOldParaclinical } from '../services/examinationService';
import { ERROR_SERVER, ROLE, status } from '../utils';

export const getExaminationByIdController = async (req, res) => {
    try {
        let data = req.query;
        if (data && data.id) {
            let response = await getExaminationById(data.id);
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

export const getExaminationByUserIdController = async (req, res) => {
    try {
        let data = req.query;
        let userId = req.user.id;
        let response = await getExaminationByUserId(userId, data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const createExaminationController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.userId && data.symptom
        ) {
            let response = await createExamination(data);
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

export const updateExaminationController = async (req, res) => {
    try {
        let data = req.body;
        if (data && data.id) {
            let response = await updateExamination(data, req.user.id);
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

export const updateOldParaclinicalController = async (req, res) => {
    try {
        let data = req.body;
        let response = await updateOldParaclinical(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const deleteExaminationController = async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            let response = await deleteExamination(id);
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
        let toDate = req.query.toDate || null;
        let status = req.query.status || null;
        let staffId = req.query.staffId || null;
        let time = req.query.time || null;

        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getExaminations(date, toDate, status, staffId, +page, +limit, search, time);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getListToPayController = async (req, res) => {
    try {
        let date = req.query.date || null;
        let statusPay = req.query.statusPay || null;
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let response = await getListToPay(date, statusPay, +page, +limit, search);
        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getScheduleApoinmentController = async (req, res) => {
    try {
        let data = req.query;
        let response = await getScheduleApoinment(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getPatienStepsController = async (req, res) => {
    try {
        let data = req.query.examId;
        let response = await getPatienSteps(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Lỗi server!",
            DT: ""
        })
    }
}

export const getAllExaminationsAdminController = async (req, res) => {
    try {
        let data = req?.query || null;
        let response = await getStatisticsExamination(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getExaminationByIdAdminController = async (req, res) => {
    try {
        let data = req.query;
        let response = await getExaminationByIdAdmin(data.id);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}


export const getExamToNoticeController = async (req, res) => {
    try {
        let response = await getExamToNotice();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getListAdvanceMoneyController = async (req, res) => {
    try {
        let data = req.query;
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || '';
        const statusPay = req.query.statusPay || null;
        let response = await getListAdvanceMoney(+page, +limit, search, statusPay);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getListInpationsController = async (req, res) => {
    try {
        //console.log(req.user);
        const date = req.query.currentDate || null;
        const toDate = req.query.toDate || null;
        const statusExam = req.query.status || status.EXAMINING;
        const staffId = req.user.roleId === ROLE.ACCOUNTANT ? null : req.user.staff || null;
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || '';

        let response = await getListInpations(date, toDate, statusExam, staffId, +page, +limit, search);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const getMedicalRecordsController = async (req, res) => {
    try {
        const status = req.query.status || status.EXAMINING;
        const medicalTreatmentTier = req.query.medicalTreatmentTier || 1;
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || '';

        let response = await getMedicalRecords(+status, medicalTreatmentTier, +page, +limit, search);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const updateInpatientRoomController = async (req, res) => {
    try {
        const data = req.body;
        if (data && data.examId && data.roomId) {
            let response = await updateInpatientRoom(data.examId, data.roomId);
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

export const createAppointmentController = async (req, res) => {
    try {
        const data = req.body;
        if (data && data.userId && data.staffId && data.time && data.symptom && data.admissionDate && data.price && data.medicalTreatmentTier && data.status && data.is_appointment && data.roomName && data.roomId) {
            let response = await createAppointment(data);
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                EC: 400,
                EM: "Không đủ dữ liệu tạo lịch khám",
                DT: ""
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}

export const deleteAppointmentController = async (req, res) => {
    try {
        const data = req.body;
        let response = await deleteAppointment(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}
export const blockAppointmentController = async (req, res) => {
    try {
        const data = req.body;
        let response = await blockAppointment(data);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json(ERROR_SERVER)
    }
}