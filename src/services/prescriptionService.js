import db from '../models/index';
import { upsertPrescriptionDetail } from './prescriptionDetailService';
import { status, paymentStatus, ERROR_SERVER, ROLE } from "../utils/index";
import { Op, Sequelize } from 'sequelize';
import dayjs from 'dayjs';
import { staffLoad } from './socketService';
import { io } from "../server";

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

        let prescriptionDetail = await upsertPrescriptionDetail(prescription.id, data.prescriptionDetails);

        if (prescriptionDetail.EC !== 0) {
            return prescriptionDetail;
        }

        const listPharmacists = await db.User.findAll({
            where: { roleId: ROLE.PHARMACIST },
            attributes: ['id'],
            raw: true
        });

        staffLoad(io, listPharmacists.map(item => item.id))

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
                status: 7,
                medicalTreatmentTier: 2,
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
                        attributes: ['id', 'name', 'price', 'isCovered', 'insuranceCovered'],
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
                ['updatedAt', 'ASC']],
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

export const updatePrescription = async (data, userId) => {
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    try {
        let prescription = await db.Prescription.findOne({
            where: { id: data.id },
            transaction: t
        });

        if (!prescription) {
            await t.rollback();
            return {
                EC: 1,
                EM: "Không tìm thấy đơn thuốc",
                DT: "",
            };
        }

        // Cập nhật từng chi tiết đơn thuốc
        for (let detail of data.presDetail) {
            await db.PrescriptionDetail.update({
                insuranceCovered: detail.insuranceCovered,
            }, {
                where: {
                    prescriptionId: detail.prescriptionId,
                    medicineId: detail.medicineId
                },
                transaction: t
            });
        }
        let receiver = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'cid'],
            raw: true,
            transaction: t
        });
        let createdPayment = null;

        if (data?.payment) {
            let details = {};
            if (receiver) {
                details = { ...details, receiver, responseTime: new Date().toISOString() }
            }
            createdPayment = await db.Payment.create({
                orderId: new Date().toISOString() + "_UserId__" + userId,
                transId: prescription.id,
                amount: data.coveredPrice,
                status: paymentStatus.PAID,
                paymentMethod: data.payment,
                detail: JSON.stringify(details)
            }, { transaction: t });
        }

        // Cập nhật prescription
        await db.Prescription.update({
            status: paymentStatus.PAID,
            insuranceCovered: data.insuranceCovered,
            coveredPrice: data.coveredPrice,
            paymentId: createdPayment?.id || null,
        }, {
            where: { id: data.id },
            transaction: t
        });

        await t.commit(); // Thành công: lưu lại tất cả thay đổi

        return {
            EC: 0,
            EM: "Cập nhật đơn thuốc thành công",
            DT: [1]
        };

    } catch (error) {
        await t.rollback(); // Lỗi: hoàn tác toàn bộ
        console.log(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
};
export const updatePrescriptionMomo = async (data, payment) => {
    const t = await db.sequelize.transaction(); // Bắt đầu transaction
    try {
        let dataUpdate = data.update;
        for (let detail of dataUpdate.presDetail) {
            await db.PrescriptionDetail.update({
                insuranceCovered: detail.insuranceCovered,
            }, {
                where: {
                    prescriptionId: detail.prescriptionId,
                    medicineId: detail.medicineId
                },
                transaction: t
            });
        }

        await db.Prescription.update({
            status: paymentStatus.PAID,
            insuranceCovered: dataUpdate.insuranceCovered,
            coveredPrice: dataUpdate.coveredPrice,
            paymentId: payment?.id || null,
        }, {
            where: { id: data.id },
            transaction: t
        });
        await t.commit();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
//Chỉ dùng cho nội trú
export const createPrescription = async (data) => {
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    try {

        let examination = await db.Examination.findOne({
            where: {
                id: data.examinationId
            },
            transaction: t // Pass transaction to the query
        });

        if (!examination) {
            await transaction.rollback(); // Rollback if examination not found
            return {
                EC: 404,
                EM: "Không tìm thấy phiên khám",
                DT: ""
            }
        }

        const todayStart = dayjs().startOf('day').toDate()
        const todayEnd = dayjs().endOf('day').toDate();
        const whereCondition = {
            examinationId: data.examinationId,
            status: data.prescriptionType === 1 ? paymentStatus.PAID : paymentStatus.DISCHARGE_PAID
        };

        if (data.prescriptionType === 1) {
            whereCondition.createdAt = {
                [Op.between]: [todayStart, todayEnd]
            };
        }

        const todayPrescriptions = await db.Prescription.findOne({
            where: whereCondition,
            include: [{
                model: db.Medicine,
                as: 'prescriptionDetails',
                attributes: ['id', 'name', 'price', 'isCovered', 'insuranceCovered'],
                through: {
                    model: db.PrescriptionMedicine,
                    required: true
                },
                raw: true,
                required: true
            }],
            transaction: t
        });

        if (todayPrescriptions) {
            // Lấy chi tiết đơn thuốc cũ trước khi xóa để cộng lại vào kho
            const oldPrescriptionDetails = await db.PrescriptionDetail.findAll({
                where: {
                    prescriptionId: todayPrescriptions.id,
                },
                transaction: t
            });

            // Cộng lại số lượng thuốc vào kho
            for (const detail of oldPrescriptionDetails) {
                const medicine = await db.Medicine.findByPk(detail.medicineId, { transaction: t });
                if (medicine) {
                    await medicine.update(
                        { inventory: medicine.inventory + detail.quantity },
                        { transaction: t }
                    );
                }
            }

            // Xóa chi tiết đơn thuốc
            await db.PrescriptionDetail.destroy({
                where: {
                    prescriptionId: todayPrescriptions.id,
                },
                transaction: t
            });

            // Xóa đơn thuốc

            await todayPrescriptions.destroy({ transaction: t });
        }


        // 1. Tạo đơn thuốc
        const prescription = await db.Prescription.create({
            examinationId: data.examinationId,
            note: data.note,
            totalMoney: data.totalMoney,
            status: data.prescriptionType === 1 ? paymentStatus.PAID : paymentStatus.DISCHARGE_PAID,
        }, { transaction: t });

        // 2. Tạo chi tiết đơn thuốc từ mảng
        const details = data.prescriptionDetails.map(item => ({
            prescriptionId: prescription.id,
            medicineId: item.medicineId,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            session: item.session,
            dose: item.dose,
            dosage: item.dosage,
        }));

        await db.PrescriptionDetail.bulkCreate(details, { transaction: t });

        // Cập nhật số lượng thuốc trong kho
        for (const item of data.prescriptionDetails) {
            const medicine = await db.Medicine.findOne(
                {
                    where: { id: item.medicineId },
                    transaction: t // Pass transaction to the query
                }
            );

            if (!medicine) {
                throw new Error(`Không tìm thấy thuốc với id ${item.medicineId}`);
            }

            // Kiểm tra số lượng có đủ không
            if (medicine.inventory < item.quantity) {
                throw new Error(`Số lượng thuốc ${medicine.name} không đủ để kê đơn`);
            }

            // Cập nhật số lượng thuốc
            await medicine.update(
                { inventory: medicine.inventory - item.quantity },
                { transaction: t }
            );
        }

        // 3. Cập nhật endDate cho đơn thuốc cũ
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (data.oldPresId) {
            if (data.prescriptionType === 1) {
                await db.Prescription.update({
                    endDate: yesterday
                }, {
                    where: { id: data.oldPresId },
                    transaction: t
                });
            } else {
                await db.Prescription.update({
                    endDate: new Date()
                }, {
                    where: { id: data.oldPresId },
                    transaction: t
                });
            }
        }

        await examination.update({
            status: status.EXAMINING,
        }, { transaction: t });

        await t.commit(); // Commit nếu mọi thứ thành công

        return {
            EC: 0,
            EM: "Tạo đơn thuốc thành công",
            DT: prescription,
        };
    } catch (error) {
        await t.rollback(); // Rollback nếu có lỗi
        console.error(error);
        return {
            EC: 1,
            EM: "Lỗi server khi tạo đơn thuốc",
            DT: "",
        };
    }
};

export const deletePrescription = async (prescriptionId) => {
    const t = await db.sequelize.transaction(); // Bắt đầu transaction
    try {
        const prescription = await db.Prescription.findOne({
            where: { id: +prescriptionId },
            include: [{
                model: db.Medicine,
                as: 'prescriptionDetails',
                attributes: ['id', 'name', 'price', 'isCovered', 'insuranceCovered'],
                through: {
                    model: db.PrescriptionMedicine,
                    required: true
                },
                raw: true,
                required: true
            }],
            transaction: t
        });

        console.log("prescription", prescriptionId);

        if (!prescription) {
            return {
                EC: 1,
                EM: "Không tìm thấy đơn thuốc",
                DT: "",
            };
        }

        const oldPrescriptionDetails = await db.PrescriptionDetail.findAll({
            where: {
                prescriptionId: prescription.id,
            },
            transaction: t
        });

        // Cộng lại số lượng thuốc vào kho
        for (const detail of oldPrescriptionDetails) {
            const medicine = await db.Medicine.findByPk(detail.medicineId, { transaction: t });
            if (medicine) {
                await medicine.update(
                    { inventory: medicine.inventory + detail.quantity },
                    { transaction: t }
                );
            }
        }

        // Xóa chi tiết đơn thuốc
        await db.PrescriptionDetail.destroy({
            where: {
                prescriptionId: prescription.id,
            },
            transaction: t
        });

        await db.Prescription.destroy({
            where: { id: prescriptionId },
            transaction: t
        });

        await t.commit();

        return {
            EC: 0,
            EM: "Xóa đơn thuốc thành công",
            DT: true,
        };
    } catch (error) {
        await t.rollback(); // Rollback nếu có lỗi
        console.error(error);
        return {
            EC: 500,
            EM: "Lỗi từ server",
            DT: "",
        };
    }
}

export const getPrescriptionUsed = async (filter) => {
    try {
        const { startDate, endDate } = filter;
        const prescription = await db.Prescription.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: db.Medicine,
                as: 'prescriptionDetails',
                attributes: ['id', 'name', "unit", "exp", "inventory"],
                through: {
                    attributes: ['quantity']
                }
            }],
            nest: true,
        })

        return {
            EC: 0,
            EM: 'Lấy danh sách đơn thuốc thành công',
            DT: prescription,
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}


