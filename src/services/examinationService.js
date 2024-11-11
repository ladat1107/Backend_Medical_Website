import db from "../models/index";
import { status, pamentStatus } from "../utils/index";

const getExaminationById = async (id) => {
    try {
        let examination = await db.Examination.findOne({
            where: { id: +id, status: status.ACTIVE },
            include: [{
                model: db.VitalSign,
                as: 'examinationVitalSignData',
            }, {
                model: db.Paraclinical,
                as: 'examinationResultParaclincalData',
                include: [{
                    model: db.Staff,
                    as: 'doctorParaclinicalData',
                    attributes: ['id', 'departmentId'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'lastName', 'firstName'],
                    }],
                }],
                separate: true,
            }, {
                model: db.User,
                as: 'userExaminationData',
                attributes: ['id', 'lastName', 'firstName', 'dob', 'gender', 'phoneNumber', 'cid'],
            }, {
                model: db.Staff,
                as: 'examinationStaffData',
                attributes: ['id', 'departmentId'],
                include: [{
                    model: db.User,
                    as: 'staffUserData',
                    attributes: ['id', 'lastName', 'firstName'],
                }],
            }, {
                model: db.Prescription,
                as: 'prescriptionExamData',
                attributes: ['id', 'note', 'totalMoney', 'paymentStatus'],
                include: [{
                    model: db.PrescriptionDetail,
                    as: 'prescriptionDetails',
                    attributes: ['quantity', 'unit', 'dosage', 'price'],
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetailMedicineData',
                        attributes: ['id', 'name', 'price'],
                    }],
                    separate: true,
                }],
            }],
            nest: true,
        });

        examination = examination.get({ plain: true });

        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examination
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const getExaminationByUserId = async (userId) => {
    try {
        let examinations = await db.Examination.findAll({
            where: { userId: userId, status: status.ACTIVE },
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examinations
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const createExamination = async (data) => {
    try {
        let staff = await db.Staff.findOne({
            where: {
                id: data.staffId
            }
        });

        let examination = await db.Examination.create({
            userId: data.userId,
            staffId: data.staffId,
            symptom: data.symptom,
            admissionDate: data.date,
            dischargeDate: data.date,
            status: status.ACTIVE,
            paymentDoctorStatus: pamentStatus.UNPAID,
            price: staff.price,
            special: data.specialNote,
            insuranceCoverage: data.insuranceCoverage
        });

        return examination.id;
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const updateExamination = async (data) => {
    try {
        let existExamination = await db.Examination.findOne({
            where: { id: data.id }
        });
        if (!existExamination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }

        let examination = await db.Examination.update({
            symptom: data.symptom,
            diseaseName: data.diseaseName,
            treatmentResult: data.treatmentResult,
            admissionDate: data.admissionDate,
            dischargeDate: data.dischargeDate,
            reason: data.reason,
            medicalTreatmentTier: data.medicalTreatmentTier,
            paymentDoctorStatus: data.paymentDoctorStatus,
            price: data.price,
            special: data.special,
            insuranceCoverage: data.insuranceCoverage,
            comorbidities: data.comorbidities
        }, {
            where: { id: data.id }
        });
        return {
            EC: 0,
            EM: "Cập nhật khám bệnh thành công",
            DT: examination
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

const deleteExamination = async (id) => {
    try {
        let existExamination = await db.Examination.findOne({
            where: { id: data.id }
        });
        if (!existExamination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }

        let examination = await db.Examination.update({
            status: status.INACTIVE
        }, {
            where: { id: id }
        });
        return {
            EC: 0,
            EM: "Xóa khám bệnh thành công",
            DT: examination
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Hệ thống quá tải!",
            DT: "",
        }
    }
}

module.exports = {
    getExaminationById,
    getExaminationByUserId,
    createExamination,
    updateExamination,
    deleteExamination
}