import dayjs from "dayjs";
import db from "../models/index";
import { status, paymentStatus, ERROR_SERVER, PAYMENT_METHOD, ROLE } from "../utils/index";
import { refundMomo } from "./paymentService";
import { Op, or, Sequelize, where } from 'sequelize';
import { getThirdDigitFromLeft } from "../utils/getbenefitLevel";
import { getStaffForReExamination } from "./scheduleService";
import { io } from "../server";
import { staffLoad } from "./socketService";

const cron = require('node-cron');

export const getExaminationById = async (id) => {
    try {
        let examination = await db.Examination.findOne({
            where: { id: +id },
            include: [
                {
                    model: db.VitalSign,
                    as: 'examinationVitalSignData',
                },
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    include: [
                        {
                            model: db.Staff,
                            as: 'doctorParaclinicalData',
                            attributes: ['id', 'departmentId'],
                            include: [{
                                model: db.User,
                                as: 'staffUserData',
                                attributes: ['id', 'lastName', 'firstName'],
                            }],
                        },
                        {
                            model: db.Room,
                            as: 'roomParaclinicalData',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.ServiceType,
                            as: 'paraclinicalData',
                            attributes: ['id', 'name', 'price'],
                        }
                    ],
                    separate: true,
                },
                {
                    model: db.User,
                    as: 'userExaminationData',
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'departmentId', 'position'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'lastName', 'firstName'],
                    }],
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        through: ['quantity', 'unit', 'dosage', 'price', 'session', 'dose', 'coveredPrice']
                    }],
                },
                {
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    }, {
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
                }, {
                    model: db.AdvanceMoney,
                    as: 'advanceMoneyExaminationData',
                },
                {
                    model: db.InpatientRoom,
                    as: 'inpatientRoomExaminationData',
                    include: [
                        {
                            model: db.Room,
                            as: 'inpatientRoomRoomData',
                            attributes: ['id', 'name'],
                            include: [{
                                model: db.Department,
                                as: 'roomDepartmentData',
                                attributes: ['id', 'name'],
                            }, {
                                model: db.ServiceType,
                                as: 'serviceData',
                                attributes: ['id', 'name', 'price'],
                            }],
                        }
                    ],
                }
            ],
            nest: true,
            order: [
                [{ model: db.Prescription, as: 'prescriptionExamData' }, 'createdAt', 'DESC']
            ]
        });

        if (!examination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }

        examination = JSON.parse(JSON.stringify(examination));
        if (examination.comorbidities) {
            const diseaseCodes = examination.comorbidities.split(',').filter(code => code.trim() !== '');
            if (diseaseCodes.length > 0) {
                const diseaseDetails = await db.Disease.findAll({
                    where: {
                        code: diseaseCodes
                    },
                    attributes: ['id', 'code', 'name']
                });

                // Thêm thông tin chi tiết bệnh vào kết quả
                examination.comorbiditiesDetails = diseaseDetails;
            } else {
                examination.comorbiditiesDetails = [];
            }
        } else {
            examination.comorbiditiesDetails = [];
        }

        return {
            EC: 0,
            EM: "Lấy thông tin khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getExaminationByUserId = async (userId, filter) => {
    try {
        let statusReq = filter?.status || status.ACTIVE;
        if (statusReq === status.PENDING) {
            //Chả nhớ
        }

        let examinations = await db.Examination.findAll({
            where: {
                [Op.or]: [
                    { userId: userId },
                    { bookFor: userId }
                ],
                is_appointment: 1,
                //status: statusReq
            },
            include: [
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
                        {
                            model: db.Specialty,
                            as: 'staffSpecialtyData',
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: db.User,
                    as: 'userExaminationData',
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                }
            ],
            order: [['createdAt', 'DESC']],
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
        return ERROR_SERVER
    }
}
export const createExamination = async (data) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();

    try {
        let staff = await db.Staff.findOne({
            where: {
                id: data.staffId
            },
            transaction
        });

        let paymentObject = {};
        if (data.insuranceCode) {

            // Update thông tin bảo hiểm từ TIẾP NHẬN
            let existingInsurance = await db.Insurance.findOne({
                where: { userId: +data.userId },
                transaction
            });

            if (existingInsurance) {
                // Cập nhật bản ghi đã tồn tại
                if (existingInsurance.insuranceCode !== data.insuranceCode) {
                    existingInsurance = await existingInsurance.update({
                        insuranceCode: data.insuranceCode,
                        benefitLevel: getThirdDigitFromLeft(data.insuranceCode)
                    }, { transaction });
                }
            } else {
                // Thêm mới nếu chưa có
                existingInsurance = await db.Insurance.create({
                    insuranceCode: data.insuranceCode,
                    benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                    userId: data.userId
                }, { transaction });
            }

            if (!existingInsurance) {
                await transaction.rollback();
                return {
                    EC: 404,
                    EM: "Không tìm thấy bảo hiểm",
                    DT: ""
                }
            }

            paymentObject = {
                insuranceCode: data.insuranceCode,
                insuranceCoverage: getThirdDigitFromLeft(data.insuranceCode),
                ...(data.insuranceCovered !== undefined && { insuranceCovered: data.insuranceCovered }),
                ...(data.coveredPrice !== undefined && { coveredPrice: data.coveredPrice })
            }
        }

        // // Tính số thứ tự tiếp theo (nếu không có bản ghi nào, bắt đầu từ 1)
        // let nextNumber = maxNumber ? maxNumber + 1 : 1;

        // Tạo bản ghi Examination mới
        let examination = await db.Examination.create({
            userId: data.userId,
            staffId: data.staffId || null,
            symptom: data.symptom,
            admissionDate: data.admissionDate || new Date(),
            dischargeDate: data.dischargeDate,
            status: data.status,

            price: staff ? staff?.price : null,
            special: data.special,
            comorbidities: data.comorbidities,

            // Số vào phòng bác sĩ (number) và tên phòng (roomName)
            //number: nextNumber,
            roomName: data.roomName,
            roomId: data.roomId || null,

            // Thông tin cho người đặt trước
            time: data.time,
            visit_status: data.visit_status ? data.visit_status : 0,
            is_appointment: data.is_appointment ? data.is_appointment : 0,
            oldParaclinical: data?.oldParaclinical || null,

            isWrongTreatment: data.isWrongTreatment || 0,
            medicalTreatmentTier: data.medicalTreatmentTier || null,

            ...paymentObject
        }, { transaction });

        //Tạo thanh toán tạm ứng
        if (+data.medicalTreatmentTier === 1 && data.status === status.WAITING
            || +data.medicalTreatmentTier === 3 && data.status === status.PAID
        ) {
            await db.AdvanceMoney.create({
                exam_id: examination.id,
                date: new Date(),
                status: status.ACTIVE,
                amount: 2000000,
            }, { transaction });

            await db.InpatientRoom.create({
                examId: examination.id,
                startDate: new Date(),
                roomId: data.roomId,
                roomName: data.roomName
            }, { transaction });
        }

        //Socket khi tạo khám bệnh
        if (data.status === status.WAITING && examination) {
            const listAccountants = await db.User.findAll({
                where: { roleId: ROLE.ACCOUNTANT },
                attributes: ['id'],
                raw: true,
                transaction
            });

            staffLoad(io, listAccountants.map(item => item.id));
        } 

        // Commit transaction if all operations are successful
        await transaction.commit();

        return {
            EC: 0,
            EM: "Tạo khám bệnh thành công",
            DT: examination
        };
    } catch (error) {
        // Rollback transaction if any operation fails
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER;
    }
};

export const updateExamination = async (data, userId) => {
    // Initialize transaction
    const transaction = await db.sequelize.transaction();

    try {
        let paymentObject = {};

        let existExamination = await db.Examination.findOne({
            where: { id: data.id },
            transaction
        });

        let receiver = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'cid'],
            raw: true,
            transaction
        });

        if (!existExamination) {
            await transaction.rollback();
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }

        if (data.payment) {
            let details = {};
            if (receiver) {
                details = { ...details, receiver, responseTime: new Date().toISOString() }
            }
            let payment = await db.Payment.create({
                orderId: new Date().toISOString() + "_UserId__" + userId,
                transId: existExamination.id,
                amount: data.advanceId ? data.advanceMoney
                    : data.status === status.DONE_INPATIENT ? data.amount
                        : data?.coveredPrice || existExamination.price,
                paymentMethod: data.payment,
                status: paymentStatus.PAID,
                detail: JSON.stringify(details)
            }, { transaction });

            paymentObject = {
                paymentId: payment.id,
            }

            if (data.status === status.DONE_INPATIENT) {
                await db.AdvanceMoney.create({
                    exam_id: existExamination.id,
                    date: new Date(),
                    status: paymentStatus.PAID,
                    amount: data.amount,
                    paymentId: payment.id,
                }, { transaction });

                let payment0 = await db.Payment.create({
                    orderId: new Date().toISOString() + "ExaminationId__" + existExamination.id,
                    transId: existExamination.id,
                    amount: 0,
                    paymentMethod: PAYMENT_METHOD.CASH,
                    status: paymentStatus.PAID,
                    detail: JSON.stringify(details)
                }, { transaction });

                paymentObject = {
                    paymentId: payment0.id,
                }
            }
        }

        if (data.insuranceCode && !data.advanceId) {

            // Update thông tin bảo hiểm từ TIẾP NHẬN
            let existingInsurance = await db.Insurance.findOne({
                where: { userId: existExamination.userId },
                transaction
            });

            if (existingInsurance) {
                // Cập nhật bản ghi đã tồn tại
                if (existingInsurance.insuranceCode !== data.insuranceCode) {
                    existingInsurance = await existingInsurance.update({
                        insuranceCode: data.insuranceCode,
                        benefitLevel: getThirdDigitFromLeft(data.insuranceCode)
                    }, { transaction });
                }
            } else {
                // Thêm mới nếu chưa có
                existingInsurance = await db.Insurance.create({
                    insuranceCode: data.insuranceCode,
                    benefitLevel: getThirdDigitFromLeft(data.insuranceCode),
                    userId: existExamination.userId
                }, { transaction });
            }

            paymentObject = {
                ...paymentObject,
                insuranceCode: data.insuranceCode,
                insuranceCoverage: getThirdDigitFromLeft(data.insuranceCode),
                ...(data.insuranceCovered !== undefined && { insuranceCovered: data.insuranceCovered }),
                ...(data.coveredPrice !== undefined && { coveredPrice: data.coveredPrice }),
            }
        }

        let examination = await db.Examination.update({
            ...(data.symptom !== undefined && { symptom: data.symptom }),
            ...(data.diseaseName !== undefined && { diseaseName: data.diseaseName }),
            ...(data.treatmentResult !== undefined && { treatmentResult: data.treatmentResult }),
            ...(data.admissionDate !== undefined && { admissionDate: data.admissionDate }),
            ...(data.dischargeDate !== undefined && { dischargeDate: data.dischargeDate }),
            ...(data.reason !== undefined && { reason: data.reason }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.special !== undefined && { special: data.special }),
            ...(data.comorbidities !== undefined && { comorbidities: data.comorbidities }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.visit_status !== undefined && { visit_status: data.visit_status }),
            ...(data.reExaminationDate !== undefined && { reExaminationDate: data.reExaminationDate }),
            ...(data.dischargeStatus !== undefined && { dischargeStatus: data.dischargeStatus }),
            ...(data.time !== undefined && { reExaminationTime: data.time }),
            ...(data.roomName !== undefined && { roomName: data.roomName }),
            ...(data.roomId !== undefined && { roomId: data.roomId }),
            ...(data.isWrongTreatment !== undefined && { isWrongTreatment: data.isWrongTreatment }),
            ...(data.medicalTreatmentTier !== undefined && { medicalTreatmentTier: data.medicalTreatmentTier }),
            ...(data.insuranceCovered !== undefined && { insuranceCovered: data.insuranceCovered }),
            ...(data.coveredPrice !== undefined && { coveredPrice: data.coveredPrice }),

            ...paymentObject
        }, {
            where: { id: data.id },
            transaction
        });

        if (existExamination.status === status.DONE && existExamination.dischargeStatus === 4
            && data.status === status.EXAMINING && !data.dischargeStatus) {
            await db.Examination.destroy({
                where: { parentExaminationId: existExamination.id },
                transaction: transaction
            });
        }

        //Nhập viện
        if (existExamination &&
            (existExamination.medicalTreatmentTier === 2 && (+data.medicalTreatmentTier === 1 || +data.medicalTreatmentTier === 3))
        ) {
            const allParaclinical = await db.Paraclinical.findAll({
                where: {
                    examinationId: existExamination.id,
                    [Op.or]: [
                        { status: status.PAID },
                        { status: status.EXAMINING },
                        { status: status.DONE }
                    ]
                },
                transaction
            });

            //tính tổng price trong all paraclinical
            let totalPrice = 0;
            allParaclinical.forEach(item => {
                totalPrice += item.coveredPrice;
            });

            // await db.AdvanceMoney.create({
            //     exam_id: existExamination.id,
            //     date: new Date(),
            //     status: paymentStatus.PAID,
            //     amount: existExamination.coveredPrice + totalPrice,
            // }, { transaction });

            await db.AdvanceMoney.create({
                exam_id: existExamination.id,
                date: new Date(),
                status: paymentStatus.PENDING,
            }, { transaction });

            await db.InpatientRoom.create({
                examId: existExamination.id,
                startDate: new Date(),
                roomId: data.roomId,
                roomName: data.roomName
            }, { transaction });

            await existExamination.update({
                staffId: null,
                status: existExamination.medicalTreatmentTier === 1 ? status.WAITING : status.PAID,
                price: null,
                insuranceCovered: null,
                coveredPrice: null,
            }, { transaction });

            await db.Paraclinical.update({
                status: status.PAID,
            }, {
                where: {
                    examinationId: existExamination.id,
                    status: status.WAITING
                },
                transaction
            })
        }

        //Hoàn thành thanh toán tạm ứng ở kế toán
        if (data.advanceId) {
            await db.AdvanceMoney.update({
                ...paymentObject,
                amount: +data.advanceMoney,
                status: paymentStatus.PAID,
            }, {
                where: { id: data.advanceId },
                transaction
            });
        }

        // Sửa phòng nội trú ở kế toán
        if (existExamination && data.updateRoomId && data.roomId) {
            await db.InpatientRoom.update({
                roomId: data.roomId,
                roomName: data.roomName
            }, {
                where: {
                    examId: existExamination.id,
                    roomId: data.updateRoomId
                },
                transaction
            });
        }

        // Tạo lịch tái khám nếu có
        if (examination && data.dischargeStatus === 4 && data.reExaminationDate && data.createReExamination) {
            const st = await getStaffForReExamination(existExamination.staffId, data.reExaminationDate);

            const insuranceCode = await db.Insurance.findOne({
                where: { userId: existExamination.userId },
                attributes: ['insuranceCode'],
                transaction
            });

            const reExam = await db.Examination.findOne({
                where: {
                    parentExaminationId: existExamination.id,
                },
                transaction
            });

            if (reExam) {
                await db.Examination.update({
                    staffId: st ? st.staffId : null,
                    admissionDate: data.reExaminationDate,
                    dischargeDate: data.reExaminationDate,
                    reason: 'Tái khám theo lịch hẹn',
                    time: data.time,
                    roomName: st ? st.scheduleRoomData.name : null,
                    price: st ? st?.staffScheduleData.price : null,
                }, {
                    where: { id: reExam.id },
                    transaction
                });
            } else {
                await db.Examination.create({
                    userId: existExamination.userId,
                    staffId: st ? st.staffId : null,
                    admissionDate: data.reExaminationDate,
                    reason: 'Tái khám theo lịch hẹn',
                    status: status.PENDING,
                    price: st ? st?.staffScheduleData.price : null,
                    special: existExamination.special,
                    comorbidities: existExamination.comorbidities,

                    insuranceCode: insuranceCode?.insuranceCode || null,
                    insuranceCoverage: getThirdDigitFromLeft(insuranceCode?.insuranceCode || ""),

                    // Số vào phòng bác sĩ (number) và tên phòng (roomName)
                    //number: existExamination.number + 1,
                    roomName: st ? st.scheduleRoomData.name : null,

                    // Thông tin cho người đặt trước
                    time: data.time,
                    visit_status: 0,
                    is_appointment: 1,
                    parentExaminationId: existExamination.id,
                }, { transaction });
            }
        }

        //Socket khi thay đổi trạng thái khám bệnh
        if(data.status !== existExamination.status) {
            switch (data.status) {
                case status.WAITING:
                case status.DONE_INPATIENT:
                    const listAccountants = await db.User.findAll({
                        where: { roleId: ROLE.ACCOUNTANT },
                        attributes: ['id'],
                        raw: true,
                        transaction
                    });    

                    staffLoad(io, listAccountants.map(item => item.id))
                    break;
                
                case status.PAID:
                    const listDoctors = await db.User.findAll({
                        where: { 
                            [Op.or]: [
                                { roleId: ROLE.DOCTOR },
                                { roleId: ROLE.NURSE }
                            ]
                        },
                        attributes: ['id'],
                        raw: true,
                        transaction
                    });

                    staffLoad(io, listDoctors.map(item => item.id))
                    break;

                case status.DONE:
                    const listPharmacists = await db.User.findAll({
                        where: { roleId: ROLE.PHARMACIST },
                        attributes: ['id'],
                        raw: true,
                        transaction
                    });

                    staffLoad(io, listPharmacists.map(item => item.id))
                    break;
            } 
        }

        // Commit transaction if all operations are successful
        await transaction.commit();

        return {
            EC: 0,
            EM: "Cập nhật khám bệnh thành công",
            DT: examination
        }
    } catch (error) {
        // Rollback transaction if any operation fails
        await transaction.rollback();
        console.log(error);
        return ERROR_SERVER;
    }
}

export const updateExaminationMomo = async (data, payment) => {
    try {
        let dataUpdate = data.update;
        await db.Examination.update({
            insuranceCoverage: dataUpdate?.insuranceCoverage || null,
            insuranceCode: dataUpdate?.insuranceCode || null,
            insuranceCovered: dataUpdate?.insuranceCovered || null,
            coveredPrice: dataUpdate?.coveredPrice || null,
            status: dataUpdate?.status,
            paymentId: payment.id,
        }, {
            where: { id: data.id }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const dischargedPaymentMomo = async (data, payment) => {
    let transaction = await db.sequelize.transaction();
    try {
        let dataUpdate = data.update;
        await db.AdvanceMoney.create({
            exam_id: data.id,
            date: new Date(),
            status: paymentStatus.PAID,
            amount: dataUpdate?.amount,
            paymentId: payment.id,
        }, { transaction });
        let paymentExamination = await db.Payment.create({
            orderId: new Date().toISOString() + "ExaminationId__" + data.id,
            transId: data.id,
            amount: 0,
            paymentMethod: PAYMENT_METHOD.CASH,
            status: paymentStatus.PAID,
        }, { transaction });
        await db.Examination.update({
            status: dataUpdate?.status,
            price: dataUpdate?.price,
            insuranceCovered: dataUpdate?.insuranceCovered,
            coveredPrice: dataUpdate?.coveredPrice,
            paymentId: paymentExamination.id,
        }, {
            where: { id: data.id },
            transaction
        });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return false;
    }
}

export const deleteExamination = async (id) => {
    try {
        let existExamination = await db.Examination.findOne({
            where: { id: id },
            raw: true,
            nest: true,
        });
        if (!existExamination) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }
        if (existExamination.status !== status.PENDING || dayjs(existExamination.admissionDate).isBefore(dayjs().add(1, 'day').startOf('day'))) {
            return {
                EC: 400,
                EM: "Không thể hủy lịch hẹn",
                DT: ""
            }
        }

        await db.Examination.update({
            status: status.INACTIVE,
        }, {
            where: { id: id }
        })

        return {
            EC: 0,
            EM: "Hủy lịch hẹn thành công",
            DT: ""
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getExaminations = async (date, toDate, status, staffId, page, limit, search, time) => {
    try {
        const whereCondition = {};

        // Date filter
        if (date && toDate) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(toDate).setHours(23, 59, 59, 999); // Kết thúc ngày

            whereCondition.admissionDate = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        const totalPatient = await db.Examination.count({
            where: {
                ...whereCondition,
                status: { [Op.gte]: 4 },
            }
        });

        const totalAppointment = await db.Examination.count({
            where: {
                ...whereCondition,
                status: 2,
            }
        });

        // Staff ID filter
        if (staffId) {
            whereCondition.staffId = staffId;
        } else {
            whereCondition.medicalTreatmentTier = 2;
        }

        // Status filter
        if (status !== undefined && status !== null) {
            whereCondition.status = +status === 4 ? { [Op.in]: [4, 5, 6] } : +status;
        }

        // Time filter
        if (time) {
            whereCondition.time = time;
        }

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
                ...whereCondition,
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
                            { lastName: { [Op.like]: `%${search}%` } },
                            { phoneNumber: { [Op.like]: `%${search}%` } },
                            { cid: { [Op.like]: `%${search}%` } }
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
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    }, {
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
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
export const getScheduleApoinment = async (filter) => {
    try {
        let listDate = filter?.date || [];
        const results = await db.Examination.findAll({
            attributes: [
                [Sequelize.literal("DATE(admissionDate)"), "date"], // Lấy phần ngày từ `createdAt`
                "time",
                [Sequelize.fn("COUNT", Sequelize.col("time")), "count"], // Đếm số lần xuất hiện của mỗi `time`
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.literal("DATE(admissionDate)"), { [Op.in]: listDate }), // So sánh phần ngày của `createdAt`
                    { is_appointment: 1 }, // Chỉ lấy các bản ghi đã hẹn
                    { status: status.PENDING },
                ],
            },
            group: ["date", "time"], // Nhóm theo ngày và time
            raw: true, // Trả về kết quả dạng thô
        });
        return {
            EC: 0,
            EM: "Lấy dữ liệu thành công",
            DT: results,
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const updateOldParaclinical = async (data) => {
    try {
        let { id, oldParaclinical } = data;
        let updateOldParaclinical = await db.Examination.update({ oldParaclinical: oldParaclinical }, { where: { id } });
        if (updateOldParaclinical[0] === 0) {
            return {
                EC: 404,
                EM: "Không tìm thấy khám bệnh",
                DT: ""
            }
        }
        return {
            EC: 0,
            EM: "Cập nhật thành công",
            DT: updateOldParaclinical
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER
    }
}
export const getListToPay = async (date, statusPay, page, limit, search) => {
    try {
        // Prepare base where conditions
        const whereConditionExamination = {
            medicalTreatmentTier: 2,
        };
        const whereConditionParaclinical = {};

        // Date filter
        if (date) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999); // End of day

            whereConditionExamination.admissionDate = {
                [Op.between]: [startOfDay, endOfDay],
            };
            whereConditionParaclinical.createdAt = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        // Status filter
        if (statusPay <= 4) {
            whereConditionExamination.status = statusPay;
            whereConditionParaclinical.status = statusPay;
        } else if (statusPay > 4) {
            whereConditionExamination.status = { [Op.gte]: statusPay };
            whereConditionParaclinical.status = { [Op.gte]: statusPay };
        }

        // Fetch data with associations
        const examinations = await db.Examination.findAll({
            where: whereConditionExamination,
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } },
                            { phoneNumber: { [Op.like]: `%${search}%` } },
                            { cid: { [Op.like]: `%${search}%` } }
                        ]
                    } : {},
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }]
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
            ]
        });

        const paraclinicals = await db.Paraclinical.findAll({
            where: whereConditionParaclinical,
            include: [
                {
                    model: db.Examination,
                    as: 'examinationResultParaclincalData',
                    attributes: ['id', 'symptom', 'insuranceCoverage', 'insuranceCode', 'special', 'visit_status', 'isWrongTreatment', 'medicalTreatmentTier', 'createdAt'],
                    where: {
                        medicalTreatmentTier: 2
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'userExaminationData',
                            where: search ? {
                                [Op.or]: [
                                    { firstName: { [Op.like]: `%${search}%` } },
                                    { lastName: { [Op.like]: `%${search}%` } },
                                    { phoneNumber: { [Op.like]: `%${search}%` } },
                                    { cid: { [Op.like]: `%${search}%` } }
                                ]
                            } : {},
                            required: true,
                        },
                    ],
                    required: true,
                },
                {
                    model: db.Staff,
                    as: 'doctorParaclinicalData',
                    attributes: ['id', 'position', 'price'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                },
                {
                    model: db.Room,
                    as: 'roomParaclinicalData',
                    attributes: ['id', 'name'],
                },
            ]
        });

        // Combine and sort the lists
        const combinedList = [
            ...examinations.map(exam => ({
                type: 'examination',
                data: { ...exam.toJSON(), status: statusPay },
                createdAt: exam.createdAt,
                special: exam.special,
                userName: exam.userExaminationData.firstName + ' ' + exam.userExaminationData.lastName,
                userPhone: exam.userExaminationData.phoneNumber,
            })),
            // Nhóm paraclinicals theo examinationId
            ...Object.values(
                paraclinicals.reduce((acc, parac) => {
                    const examinationId = parac.examinationId;
                    if (!acc[examinationId]) {
                        acc[examinationId] = {
                            type: 'paraclinical',
                            data: {
                                ...parac.examinationResultParaclincalData.toJSON(),
                                paraclinicalItems: [],
                                status: statusPay,
                                totalParaclinicalPrice: 0
                            },
                            createdAt: parac.createdAt,
                            special: parac.examinationResultParaclincalData.special,
                            userName: parac.examinationResultParaclincalData.userExaminationData.lastName +
                                ' ' +
                                parac.examinationResultParaclincalData.userExaminationData.firstName,
                            userPhone: parac.examinationResultParaclincalData.userExaminationData.phoneNumber
                        };
                    }

                    // Thêm thông tin chi tiết của từng paraclinical vào mảng paraclinicalItems
                    const paracItem = {
                        id: parac.id,
                        paraclinical: parac.paraclinical,
                        paracName: parac.paracName,
                        price: parac.price,
                        status: parac.status,
                        doctorInfo: {
                            id: parac.doctorParaclinicalData.id,
                            position: parac.doctorParaclinicalData.position,
                            doctorName: parac.doctorParaclinicalData.staffUserData.lastName +
                                ' ' +
                                parac.doctorParaclinicalData.staffUserData.firstName
                        },
                        roomInfo: {
                            id: parac.roomParaclinicalData.id,
                            name: parac.roomParaclinicalData.name
                        }
                    };

                    acc[examinationId].data.paraclinicalItems.push(paracItem);

                    // Cộng dồn tổng giá
                    acc[examinationId].data.totalParaclinicalPrice += parac.price;

                    return acc;
                }, {})
            )
        ];

        // Sắp xếp theo special và createdAt - CHỈ ORDER MỘT LẦN DUY NHẤT TẠI ĐÂY
        const sortedList = combinedList.sort((itemA, itemB) => {
            // Helper function để lấy priority của special
            const getSpecialPriority = (special) => {
                if (['old', 'children', 'disabled', 'pregnant'].includes(special)) return 1;
                if (special === 'normal') return 2;
                return 3;
            };

            const priorityA = getSpecialPriority(itemA.special);
            const priorityB = getSpecialPriority(itemB.special);

            // Sắp xếp theo special trước
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Nếu cùng priority special, sắp xếp theo createdAt (mới nhất lên trước)
            const dateA = new Date(itemA.createdAt);
            const dateB = new Date(itemB.createdAt);
            return dateA.getTime() - dateB.getTime();
        });
        // Áp dụng phân trang
        const totalItems = sortedList.length;
        const pageNum = page || 1;
        const limitNum = limit || 10;
        const offset = (pageNum - 1) * limitNum;
        const paginatedList = sortedList.slice(offset, offset + limitNum);

        return {
            EC: 0,
            EM: 'Lấy danh sách thành công',
            DT: {
                list: paginatedList,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalItems
                }
            }
        };

    } catch (error) {
        console.error('Error fetching examinations and paraclinicals:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};
export const getPatienSteps = async (examId) => {
    try {
        const examination = await db.Examination.findOne({
            where: { id: examId },
            attributes: ['id', 'status', 'roomName'],
            include: [
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    attributes: ['id', 'paraclinical', 'paracName', 'status'],
                    include: [
                        {
                            model: db.Room,
                            as: 'roomParaclinicalData',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: db.ServiceType,
                            as: 'paraclinicalData',
                            attributes: ['id', 'name', 'price'],
                        }
                    ],
                    separate: true,
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    attributes: ['id', 'note', 'totalMoney'],
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: ['quantity', 'unit', 'dosage', 'price']
                    }],
                }
            ],
            nest: true,
        });

        if (!examination) {
            return {
                EC: 404,
                EM: 'Không tìm thấy thông tin khám bệnh',
                DT: '',
            };
        }

        // Format steps data
        const formatSteps = (data, isParaclinical = false) => {
            const stepLabels = isParaclinical ? {
                4: 'Chờ thanh toán',
                5: 'Chờ thực hiện cận lâm sàng',
                6: 'Thực hiện cận lâm sàng'
            } : {
                4: 'Chờ thanh toán',
                5: 'Chờ khám bệnh',
                6: 'Khám bệnh'
            };

            return {
                currentStatus: data.status,
                currentStep: stepLabels[data.status] || 'Chưa xác định',
                roomInfo: data.roomName || null,
                completedSteps: Object.keys(stepLabels)
                    .map(step => ({
                        status: Number(step),
                        label: stepLabels[step],
                        isCompleted: Number(step) < data.status,
                        isActive: Number(step) === data.status
                    }))
            };
        };

        // Transform response data
        const transformedData = {
            mainExamination: formatSteps(examination),
            paraclinicalTests: examination.examinationResultParaclincalData.map(test => ({
                id: test.id,
                name: test.paracName,
                room: test.roomParaclinicalData.name,
                price: test.paraclinicalData.price,
                steps: formatSteps(test, true)
            }))
        };

        return {
            EC: 0,
            EM: 'Lấy thông tin bệnh nhân thành công',
            DT: transformedData
        };

    } catch (error) {
        console.error('Error fetching patient steps:', error);
        return {
            EC: 500,
            EM: 'Lỗi server!',
            DT: '',
        };
    }
};
export const getExamToNotice = async () => {
    try {
        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow

        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999); // End of tomorrow

        // Find examinations with reExaminationDate set to tomorrow
        const examinations = await db.Examination.findAll({
            where: {
                reExaminationDate: {
                    [Op.between]: [tomorrow, endOfTomorrow]
                }
            },
            attributes: ['id', 'userId', 'reExaminationDate', 'diseaseName'],
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                }
            ],
            raw: true,
            nest: true
        });

        return {
            EC: 0,
            EM: "Lấy danh sách tái khám thành công",
            DT: examinations
        };
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
export const getStatisticsExamination = async (filter) => {
    try {
        const { startDate, endDate } = filter;
        let whereCondition = {};
        if (startDate && endDate) {
            whereCondition.admissionDate = {
                [Op.between]: [startDate, endDate]
            }
        }
        const examinations = await db.Examination.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'cid'],
                },
                {
                    model: db.Payment,
                    as: 'paymentData',
                }, {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price'],
                    include: [{
                        model: db.User,
                        as: 'staffUserData',
                        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email', "status", "cid"],
                    }, {
                        model: db.Department,
                        as: 'staffDepartmentData',
                        attributes: ['id', 'name'],
                    }]
                },
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    include: [
                        {
                            model: db.Payment,
                            as: 'paymentData',
                        }
                    ]
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    include: [
                        {
                            model: db.Payment,
                            as: 'paymentData',
                        }
                    ]
                },
            ],
            nest: true,
        })
        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công',
            DT: examinations
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER;
    }
}
export const getExaminationByIdAdmin = async (id) => {
    try {
        let examination = await db.Examination.findOne({
            where: { id: id },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'cid', 'phoneNumber'],
                },
                {
                    model: db.Staff,
                    as: 'examinationStaffData',
                    attributes: ['id', 'position', 'price', 'departmentId'],
                    include: [
                        {
                            model: db.User,
                            as: 'staffUserData',
                            attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                        },
                        {
                            model: db.Department,
                            as: 'staffDepartmentData',
                            attributes: ['id', 'name'],
                        }
                    ]
                },
                {
                    model: db.Paraclinical,
                    as: 'examinationResultParaclincalData',
                    include: [
                        {
                            model: db.Room,
                            as: 'roomParaclinicalData',
                        },
                        {
                            model: db.ServiceType,
                            as: 'paraclinicalData',
                            attributes: ['id', 'name', 'price'],
                        },
                        {
                            model: db.Staff,
                            as: 'doctorParaclinicalData',
                            attributes: ['id', 'position', 'price'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'staffUserData',
                                    attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                                },
                                {
                                    model: db.Department,
                                    as: 'staffDepartmentData',
                                    attributes: ['id', 'name'],
                                }
                            ]
                        },
                        {
                            model: db.Payment,
                            as: 'paymentData',
                            attributes: ['id', 'status', 'amount', 'paymentMethod'],
                        }
                    ],
                    separate: true,
                },
                {
                    model: db.Prescription,
                    as: 'prescriptionExamData',
                    include: [{
                        model: db.Medicine,
                        as: 'prescriptionDetails',
                        attributes: ['id', 'name', 'price'],
                        through: ['quantity', 'unit', 'dosage', 'price']
                    },
                    {
                        model: db.Payment,
                        as: 'paymentData',
                    }
                    ],
                },
                {
                    model: db.Payment,
                    as: 'paymentData',
                    attributes: ['id', 'status', 'amount', 'paymentMethod'],
                },
                {
                    model: db.VitalSign,
                    as: 'examinationVitalSignData',
                },
                {
                    model: db.AdvanceMoney,
                    as: 'advanceMoneyExaminationData',
                    include: [
                        {
                            model: db.Payment,
                            as: 'paymentData',
                        }
                    ]
                }
            ],
            nest: true,
        })
        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công',
            DT: examination
        }
    } catch (error) {
        console.log(error);
        return ERROR_SERVER

    }
}
export const getListAdvanceMoney = async (page, limit, search, statusPay) => {
    try {
        const whereConditionExamination = {
            medicalTreatmentTier: {
                [Op.or]: [1, 3]
            },
            status: { [Op.lt]: status.DONE },
        };

        const examinations = await db.Examination.findAll({
            where: whereConditionExamination,
            include: [{
                model: db.User,
                as: 'userExaminationData',
                // Add search condition to include
                where: search ? {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${search}%` } },
                        { lastName: { [Op.like]: `%${search}%` } },
                        { phoneNumber: { [Op.like]: `%${search}%` } },
                        { cid: { [Op.like]: `%${search}%` } }
                    ]
                } : {},
                include: [{
                    model: db.Insurance,
                    as: "userInsuranceData",
                    attributes: ["insuranceCode"]
                }]
            }, {
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
            }, {
                model: db.AdvanceMoney,
                as: 'advanceMoneyExaminationData',
                attributes: ['id', 'amount', 'date', 'status'],
                where: {
                    status: statusPay,
                },
                required: true,
            }, {
                model: db.Room,
                as: 'examinationRoomData',
                attributes: ['id', 'name'],
                include: [{
                    model: db.Department,
                    as: 'roomDepartmentData',
                    attributes: ['id', 'name'],
                }, {
                    model: db.ServiceType,
                    as: 'serviceData',
                    attributes: ['id', 'name', 'price'],
                }],
            }],
            order: [
                ['medicalTreatmentTier', 'DESC'],
                ['createdAt', 'ASC']
            ],
            limit: limit,
            offset: (page - 1) * limit,
            distinct: true
        });

        const totalItems = await db.Examination.count({
            where: {
                medicalTreatmentTier: 1,
                status: status.WAITING,
            },
            include: [
                {
                    model: db.AdvanceMoney,
                    as: 'advanceMoneyExaminationData',
                    where: {
                        status: statusPay,
                    },
                    required: true,
                },
            ],
        });

        return {
            EC: 0,
            EM: 'Lấy danh sách khám bệnh thành công!',
            DT: {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
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
}
export const getListInpations = async (date, toDate, statusExam, staffId, page, limit, search) => {
    try {
        let staff = null;
        if (staffId) {
            staff = await db.Staff.findOne({
                where: { id: staffId },
                include: [{
                    model: db.Department,
                    as: 'staffDepartmentData'
                }],
                raw: true,
                nest: true,
            })

            if (!staff) {
                return {
                    EC: 404,
                    EM: "Không tìm thấy nhân viên",
                    DT: "",
                }
            }
        }

        let whereCondition = {
            [Op.or]: [
                { medicalTreatmentTier: 1 },
                { medicalTreatmentTier: 3 }
            ],
            status: +statusExam
        };

        // Date filter
        if (date && toDate) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Bắt đầu ngày
            const endOfDay = new Date(toDate).setHours(23, 59, 59, 999); // Kết thúc ngày

            if (+statusExam === status.DONE) {
                whereCondition.dischargeDate = {
                    [Op.between]: [startOfDay, endOfDay],
                };
                whereCondition.status = { [Op.gte]: +statusExam };
            }
        }

        let whereRoomCondition = {};
        if (staff && staff.staffDepartmentData && staff.staffDepartmentData.id) {
            whereRoomCondition = {
                id: staff.staffDepartmentData.id
            };
        }

        const { count, rows: examinations } = await db.Examination.findAndCountAll({
            where: {
                ...whereCondition,
            },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }],
                    // Add search condition to include
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } },
                            { phoneNumber: { [Op.like]: `%${search}%` } },
                            { cid: { [Op.like]: `%${search}%` } }
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
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                        where: whereRoomCondition,
                        required: true,
                    }, {
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
                    required: true,
                },
            ],
            limit: limit,
            offset: (page - 1) * limit,
            order: [
                ['admissionDate', 'DESC'],
            ],
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
}
export const getMedicalRecords = async (status, medicalTreatmentTier, page, limit, search) => {
    try {
        const whereCondition = {
            medicalTreatmentTier: medicalTreatmentTier
        };

        // Status filter
        if (status !== undefined && status !== null) {
            whereCondition.status =
                +status === 6 ? {
                    [Op.lte]: 6,
                    [Op.gte]: 4
                } : status === 7 ? {
                    [Op.gte]: 7
                } : status;
        }

        let offset, limit_query;
        const { count, rows: examinations } = await db.Examination.findAndCountAll({
            where: {
                ...whereCondition
            },
            include: [
                {
                    model: db.User,
                    as: 'userExaminationData',
                    include: [{
                        model: db.Insurance,
                        as: "userInsuranceData",
                        attributes: ["insuranceCode"]
                    }, {
                        model: db.Relative,
                        as: 'userRelativeData',
                        attributes: ['id', 'fullName', 'cid', 'phoneNumber', 'relationship', 'address'],
                    }],
                    // Add search condition to include
                    where: search ? {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${search}%` } },
                            { lastName: { [Op.like]: `%${search}%` } },
                            { phoneNumber: { [Op.like]: `%${search}%` } },
                            { cid: { [Op.like]: `%${search}%` } }
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
                    model: db.Room,
                    as: 'examinationRoomData',
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Department,
                        as: 'roomDepartmentData',
                        attributes: ['id', 'name'],
                    }, {
                        model: db.ServiceType,
                        as: 'serviceData',
                        attributes: ['id', 'name', 'price'],
                    }],
                }
            ],
            limit: limit_query,
            offset,
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
}

export const updateInpatientRoom = async (examId, roomId) => {
    const t = await db.sequelize.transaction();
    try {
        const existingInpatientRoom = await db.InpatientRoom.findOne({
            where: {
                examId: examId,
                endDate: null
            },
            transaction: t,
            raw: false
        });

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        let existingStartDate = new Date(existingInpatientRoom.startDate);
        existingStartDate.setHours(0, 0, 0, 0);

        if (existingInpatientRoom) {
            if (yesterday < existingStartDate) {
                await existingInpatientRoom.destroy({
                    transaction: t
                })
            } else {
                await existingInpatientRoom.update({
                    endDate: yesterday
                }, {
                    transaction: t
                });
            }
        }

        const getRoom = await db.Room.findOne({
            where: { id: roomId },
            transaction: t
        });

        await db.Examination.update({
            roomId: roomId,
            roomName: getRoom.name
        }, {
            where: { id: examId },
            transaction: t
        });

        await db.InpatientRoom.destroy({
            where: {
                examId: examId,
                startDate: {
                    [Op.between]: [
                        new Date().setHours(0, 0, 0, 0),
                        new Date().setHours(23, 59, 59, 999)
                    ]
                }
            },
            transaction: t
        });

        const newInpatientRoom = await db.InpatientRoom.create({
            examId: examId,
            roomId: roomId,
            roomName: getRoom.name,
            startDate: new Date()
        }, {
            transaction: t
        });

        await t.commit();
        return {
            EC: 0,
            EM: 'Cập nhật phòng thành công',
            DT: newInpatientRoom
        };

    } catch (error) {
        await t.rollback();

        console.error('Error updating inpatient room:', error);
        return {
            EC: 500,
            EM: 'Lỗi server',
            DT: null,
            error: error.message
        };
    }
}

//#region Lịch trình thay đổi trạng thái bệnh nhân nội trú
function reStatusInpatients(taskFunction) {
    const task = cron.schedule('0 0 * * *', () => {
        console.log(`Đang thực hiện công việc theo lịch lúc 0 giờ sáng: ${new Date()}`);
        taskFunction();
    });

    console.log('Đã lên lịch công việc vào 0 giờ sáng mỗi ngày');
    return task;
}

const reStatusInpatientsJob = reStatusInpatients(async () => {
    // Thực hiện công việc của bạn ở đây
    console.log('Đang thực hiện công việc được lên lịch vào 0 giờ sáng');
    const inpatients = await db.Examination.findAll({
        where: {
            [Op.or]: [
                { medicalTreatmentTier: 1 },
                { medicalTreatmentTier: 3 }
            ],
            status: status.EXAMINING,
            dischargeDate: null
        }
    });

    if (!inpatients || inpatients.length === 0) {
        console.log('Không có bệnh nhân nào cần thay đổi trạng thái');
        return;
    }

    await db.Examination.update({
        status: status.WAITING
    }, {
        where: {
            id: inpatients.map(inpatient => inpatient.id)
        }
    });

    console.log('Đã thay đổi trạng thái cho các bệnh nhân nội trú đã qua ngày hẹn khám.');
})
