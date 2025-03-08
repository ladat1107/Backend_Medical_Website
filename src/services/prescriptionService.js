import db from '../models/index';
import prescriptionDetailService from './prescriptionDetailService';
import { status, paymentStatus, ERROR_SERVER } from "../utils/index";
import { Op, Sequelize } from 'sequelize';

export const calculateTotalMoney = (details) => {
    return details.reduce((sum, detail) => sum + (detail.quantity * detail.price), 0);
};

export const getPrescriptionByExaminationId = async (examinationId) => {
    try {
        let prescription = await db.Prescription.findOne({
            where: { examinationId: examinationId },
            attributes: ['id', 'examinationId', 'note', 'totalMoney'],
            include: [{
                model: db.Medicine,
                as: 'prescriptionDetails',
                attributes: ['id', 'name', 'price'],
                through: ['quantity', 'unit', 'dosage', 'price']
            }],
            nest: true,
        });
        if (!prescription) {
            return {
                EC: 1,
                EM: "Không tìm thấy đơn thuốc",
                DT: "",
            }
        }
        return {
            EC: 0,
            EM: "Lấy thông tin đơn thuốc thành công",
            DT: prescription
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}

export const upsertPrescription = async (data) => {
    try {
        let response = await db.Examination.update(
            {
                status: status.DONE,
            },
            {
                where: {
                    id: data.examinationId
                }
            }
        );

        if (!response) {
            return {
                EC: 1,
                EM: "Không tìm thấy bệnh nhân",
                DT: "",
            }
        }

        let [prescription, created] = await db.Prescription.findOrCreate({
            where: { examinationId: data.examinationId },
            defaults: {
                note: data.note,
                totalMoney: data.totalMoney,
                status: paymentStatus.PENDING,
            }
        });

        if (!created) {
            await prescription.update({
                note: data.note,
                totalMoney: data.totalMoney,
            });
        }

        let prescriptionDetail = await prescriptionDetailService.upsertPrescriptionDetail(prescription.id, data.prescriptionDetails);

        if (prescriptionDetail.EC !== 0) {
            return prescriptionDetail;
        }

        if (!prescriptionDetail) {
            return {
                EC: 1,
                EM: "Cập nhật chi tiết đơn thuốc không thành công",
                DT: "",
            };
        } else {
            return {
                EC: 0,
                EM: created ? "Tạo đơn thuốc thành công" : "Cập nhật đơn thuốc thành công",
                DT: true
            };
        }

    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};

export const getPrescriptions = async (date, status, staffId, page, limit, search) => {
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

        // Staff ID filter
        if (staffId) {
            whereCondition.staffId = staffId;
        }

        // Status filter
        // if (status) {
        //     whereCondition.status = status;
        // }

        // Search filter (across user's first and last name)
         const searchCondition = search ? {
            [Op.or]: [
                { '$userExaminationData.firstName$': { [Op.like]: `%${search}%` } },
                { '$userExaminationData.lastName$': { [Op.like]: `%${search}%` } }
            ]
        } : {};

        let offset, limit_query;
        if (status === 2) {
            // Nếu status là 2, không phân trang
            offset = 0;
            limit_query = null;
        } else {
            offset = (page - 1) * limit;
            limit_query = limit;
        }

         const { count, rows: examinations } = await db.Examination.findAndCountAll({
            where: {
                ...searchCondition,
                status: 7
            },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid'],
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
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
                            attributes: ['firstName', 'lastName']
                        },
                    ],
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney', 'status'],
                    where: {
                        status: status
                    },
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: {
                            model: db.PrescriptionMedicine,
                            where: {
                                ...whereCondition,
                            },
                            required: true
                        },
                        required: true
                    }],
                    required: true
                }
            ],
            limit: limit_query,
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
                    'ASC'
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

export const updatePrescription = async (data, payment, userId) => {
    try {
        let prescription = await db.Prescription.findOne({
            where: { id: data.id },
        });

        if (!prescription) {
            return {
                EC: 1,
                EM: "Không tìm thấy đơn thuốc",
                DT: "",
            };
        }

        if (data.exam) {
            await db.Examination.update({
                insuaranceCode: data.exam.insuaranceCode,
                insuranceCoverage: data.exam.insuranceCoverage,
            }, {
                where: { id: data.exam.examId }
            })
        }
        if (data?.payment) {
            payment = await db.Payment.create({
                orderId: new Date().toISOString() + "_UserId__" + userId,
                transId: prescription.id,
                amount: prescription.totalMoney,
                status: paymentStatus.PAID,
                paymentMethod: data.payment,
            })
        }

        await db.Prescription.update({
            status: paymentStatus.PAID,
            paymentId: payment.id,
        }, {
            where: { id: data.id }
        })

        return {
            EC: 0,
            EM: "Cập nhật đơn thuốc thành công",
            DT: [1]
        };


    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};
