import db from "../models/index";
import { status, pamentStatus } from "../utils/index";
const { Op, ConnectionTimedOutError, Sequelize } = require('sequelize');

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
                    model: db.Medicine,
                    as: 'prescriptionDetails',
                    attributes: ['id', 'name', 'price'],    
                    through: ['quantity', 'unit', 'dosage', 'price']
                }],
            }],
            nest: true,
        });

        // examination = examination.get({ plain: true });

        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examination
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
            EM: "Lỗi server!",
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

        if (!staff) {
            return {
                EC: 404,
                EM: "Nhân viên không tồn tại",
                DT: ""
            };
        }

        // Lấy ngày hôm nay (chỉ tính ngày, không quan tâm giờ, phút, giây)
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Đặt lại giờ để so sánh chỉ theo ngày

        // Tìm số thứ tự lớn nhất của phòng trong ngày hôm nay
        let maxNumber = await db.Examination.max('number', {
            where: {
                roomName: data.roomName,
                admissionDate: {
                    [Op.gte]: today  // Chỉ lấy các bản ghi từ ngày hôm nay trở đi
                }
            }
        });

        // Tính số thứ tự tiếp theo (nếu không có bản ghi nào, bắt đầu từ 1)
        let nextNumber = maxNumber ? maxNumber + 1 : 1;

        // Tạo bản ghi Examination mới
        let examination = await db.Examination.create({
            userId: data.userId,
            staffId: data.staffId,
            symptom: data.symptom,
            admissionDate: new Date(),
            dischargeDate: new Date(),
            status: data.status,
            paymentDoctorStatus: pamentStatus.UNPAID,

            price: staff.price,
            special: data.special,
            insuranceCoverage: data.insuranceCoverage,
            comorbidities: data.comorbidities,

            // Số vào phòng bác sĩ (number) và tên phòng (roomName)
            number: nextNumber,
            roomName: data.roomName,

            // Thông tin cho người đặt trước
            time: data.time,
            visit_status: data.visit_status ? data.visit_status : 0,
            is_appointment: data.is_appointment ? data.is_appointment : 0,
        });

        return {
            EC: 0,
            EM: "Tạo khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi server!",
            DT: "",
        };
    }
};


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
            comorbidities: data.comorbidities,
            visit_status: data.visit_status ? data.visit_status : 0,
            status: data.status,
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
            EM: "Lỗi server!",
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
            EM: "Lỗi server!",
            DT: "",
        }
    }
}

const getExaminations = async (date, status, is_appointment, page, limit, search, time) => {
    try {
        const whereCondition = {};
        
        // Date filter
        if (date) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(date).setHours(23, 59, 59, 999); // Kết thúc ngày
        
            whereCondition.createdAt = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        const totalPatient = await db.Examination.count({
            where: {
                ...whereCondition,
                status: 4,
            }
        });

        const totalAppointment = await db.Examination.count({
            where: {
                ...whereCondition,  
                is_appointment: 1,
                status: 2,
            }
        });

        // Status filter
        if (status) {
            whereCondition.status = status;
        }

        // Appointment filter
        if (is_appointment) {
            whereCondition.is_appointment = is_appointment;
        }

        // Time filter
        if (time) {
            whereCondition.time = time;
        }

        // Search filter (across user's first and last name)
        const searchCondition = search ? {
            [Op.or]: [
                { '$userExaminationData.firstName$': { [Op.like]: `%${search}%` } },
                { '$userExaminationData.lastName$': { [Op.like]: `%${search}%` } }
            ]
        } : {};

        const offset = (page - 1) * limit;

        const { count, rows: examinations } = await db.Examination.findAndCountAll({
            where: {
                ...whereCondition,
                ...searchCondition
            },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    // Add search condition to include
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } }
                        ]
                    } : {}
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                },
            ],
            limit,
            offset,
            order: [
                [
                    Sequelize.literal(
                        `CASE 
                            WHEN special IN ('old', 'children', 'disabled', 'pregnant') THEN 1 
                            WHEN special = 'normal' THEN 2 
                            ELSE 3 
                        END`
                    ),
                    'ASC',
                ],
                ['visit_status', 'ASC'],
                ['createdAt', 'ASC']],
            distinct: true // Ensures correct count with joins
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalPatient: totalPatient,
                totalAppointment: totalAppointment,
                examinations: examinations,

            },
        };
    } catch (error) {
        console.error('Error fetching examinations:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};

module.exports = {
    getExaminationById,
    getExaminationByUserId,
    createExamination,
    updateExamination,
    deleteExamination,
    getExaminations
}